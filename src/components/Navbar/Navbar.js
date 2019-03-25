import React from "react";
import { Nav } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import "./Navbar.css";

class Navibar extends React.Component {
  getNavLinkClass = path => {
    return this.props.location.pathname === path ? "active" : "";
  };

  render() {
    return (
      <Navbar expand="lg" className="navbar">
        <Navbar.Brand href="/">WikiFlight</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link className="links" href="/aircrafts">
            Aircraft List
          </Nav.Link>
          <Nav.Link className="linkslog" href="/login">
            Login
          </Nav.Link>
        </Nav>
      </Navbar>
    );
  }
}

export default Navibar;
