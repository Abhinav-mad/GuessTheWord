import { useEffect, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header";
import Body from "./components/Body";
import { Row, Col, Container } from "react-bootstrap";
import axios from "axios";
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'

function App() {
  const [category, setCategory] = useState("hiphop");
  const [subcategory, setSubCategory] = useState("eminem");
  const [hint, setHint] = useState(null);
  const [userGuess, setUserGuess] = useState('');
  const [result, setResult] = useState(null);

//for confetti
const { width, height } = useWindowSize()


  useEffect(() => {
    fetchHints();
    console.log("ggggg");
    console.log(hint);
  }, [subcategory]);
  console.log(category);
  console.log(subcategory);

  const fetchHints = async () => {
    const response = await axios.get("http://localhost:3001/hint", {
      params: { category, subcategory },
    });
    console.log(response.data);
    setHint(response.data);
    setResult(null)
  };

  const handleGuessSubmit = async () => {
    console.log(userGuess)
    const response = await axios.post("http://localhost:3001/guess", {
      hintId: hint._id,
      userGuess,
    });
    setResult(response.data);
    setUserGuess('')
    
  };

  return (
    <>
      <Header
        category={category}
        subcategory={subcategory}
        setCategory={setCategory}
        setSubCategory={setSubCategory}
      />

      <div className="body-container py-5">
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col xs={12} md={8} lg={6} className="border border-1 shadow p-2">
              <h3>
                {category} Edition :{" "}
                <span className="subname">{subcategory.toUpperCase()}</span>{" "}
              </h3>
              <div className="d-flex">
                Hint :{" "}
                <div type="text"  className="border border-1  rounded hintbox ">
                {hint?.hint}
                      </div>
              </div>
              <label style={{ fontWeight: "bold" }} className="mt-5">
                Guess the {category == "hiphop" ? "Song" : "Movie"}🍀
              </label>

              <input
                value={userGuess}
                onChange={(e) => setUserGuess(e.target.value)}
                className="form-control my-1"
              ></input>

              <div className="d-flex justify-content-center ">
              { !(result?.correct) && <button
                  className="custom-btn mt-1 "
                  onClick={handleGuessSubmit}
                >
                  Guess
                </button>}
              </div>
              {result && (
                <div>

                
                { result.correct?(
                  <div>
                  <img src={result.imageUrl}  className="result-image" ></img>

                  <Confetti  numberOfPieces={50}
                  width={width}
                  height={height}
                />
                </div>
                ):(
                  <p>Oops, not quite! Keep guessing—you’re almost there</p>
                )

                
                }
                <div className="d-flex justify-content-center">
                <button className="custom-btn " onClick={fetchHints}>Try Another</button>

                </div>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default App;
