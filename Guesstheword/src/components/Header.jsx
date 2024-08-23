import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function Header({category,setCategory,subcategary,setSubCategory}) {
  return (
    <div >
          <Navbar expand="lg" className=" border border-1 border-dark shadow navbarr">
      <Container>
        <Navbar.Brand href="#home">Guess-quest</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />  
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavDropdown title="Movie" id="basic-nav-dropdown">
              <NavDropdown.Item onClick={()=>{setSubCategory('hollywood'); setCategory('Movie')}} href="#action/3.1">Hollywood</NavDropdown.Item>
              
            </NavDropdown>

            <NavDropdown title="hip-hop" id="basic-nav-dropdown">
              <NavDropdown.Item onClick={()=>{setSubCategory('2pac'); setCategory('hiphop')}} href="#action/3.1">2pac</NavDropdown.Item>
              <NavDropdown.Item onClick={()=>{setSubCategory('eminem'); setCategory('hiphop')}} href="#action/3.2">
                Eminem 
              </NavDropdown.Item>
              
            </NavDropdown>
            
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </div>
  )
}

export default Header