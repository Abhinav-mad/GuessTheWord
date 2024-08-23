import React from 'react'
import {Row,Col, Container} from 'react-bootstrap'
function Body() {
  return (
    <div className='body-container py-5'>
        <Container  className='py-5'>

        <Row className='justify-content-center'>
            <Col xs={12} md={8} lg={4} className='border border-1 ' >
                <label>Enter...</label>
                <input className='form-control'></input>
                <image src='' height={20} width={40}></image>
            </Col>

        </Row>
        </Container>

    </div>
  )
}

export default Body