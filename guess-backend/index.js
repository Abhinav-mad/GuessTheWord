const express = require("express");

const cors = require("cors");

const mongoose = require("mongoose");

const redis = require("redis");

const app = express();

app.use(cors());

app.use(express.json());

const client = redis.createClient({
  url: "redis://localhost:6379",
});

client.on("error", (err) => {
  console.error("Redis error:", err);
});

client.connect().catch(console.error);

const port = 3001;

mongoose
  .connect(
    "mongodb+srv://abhinav:abhguess@cluster0.2fkqrsu.mongodb.net/guezquest?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("mongoDB connected ");
  })
  .catch((err) => {
    console.log("mongoDB connecton failed");
    console.log(err);
  });
//mongoose.set("debug", true);

const hintSchema = new mongoose.Schema({
  category: { type: String, index: true },
  subcategory: { type: String, index: true },
  hint: String,
  answer: String,
  imageUrl: String,
});

//compound index for catogary and subcatogary
hintSchema.index({ category: 1, subcategory: 1 });

const Hint = mongoose.model("Hint", hintSchema);

app.get("/hint", async (req, res) => {
  const { category, subcategory } = req.query;
  const cacheKey = `hint :${category}:${subcategory}`;
  //console.log(category,subcategory)
  try {
    //check cache first
    const cachedHint = await client.get(cacheKey);

    if (cachedHint) {
      // Cache hit
      return res.json(JSON.parse(cachedHint));
    }

    // Cache miss
    const hint = await Hint.aggregate([
      { $match: { category, subcategory } },
      { $sample: { size: 1 } },
    ]);

    if (hint.length > 0) {
      const hintData = hint[0];
      const hintIdCacheKey = `hint:${hintData._id}`;

      // Store the result in cache with a TTL of 60 seconds
      await client.setEx(cacheKey, 60, JSON.stringify(hintData));
      await client.setEx(hintIdCacheKey, 60, JSON.stringify(hintData));

      res.json(hintData);
    } else {
      res.status(404).send("Hint not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

app.post("/guess", async (req, res) => {
  const { hintId, userGuess } = req.body;
  const cacheKey = `hint:${hintId}`;
  try {
    //check cache

    const cachedHint = await client.get(cacheKey);

    if (cachedHint) {
      // Cache hit
      const hint = JSON.parse(cachedHint);
      const isCorrect = hint.answer.toLowerCase() === userGuess.toLowerCase();

      return res.json({
        correct: isCorrect,
        answer: hint.answer,
        imageUrl: isCorrect ? hint.imageUrl : null,
      });
    }

    // Cache miss
    const hint = await Hint.findById(hintId);
    if (!hint) {
      return res.status(404).send("Hint not found");
    }

    const isCorrect = hint.answer.toLowerCase() === userGuess.toLowerCase();

    res.json({
      correct: isCorrect,
      answer: hint.answer,
      imageUrl: isCorrect ? hint.imageUrl : null,
    });

    // Cache the hint for future requests (with a TTL of 60 seconds)
    await client.setEx(cacheKey, 60, JSON.stringify(hint));
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).send("Server error");
  }
});

app.listen(port, () => {
  console.log(`server running on port : ${port}`);
});
