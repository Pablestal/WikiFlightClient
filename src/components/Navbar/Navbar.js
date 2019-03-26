import React from "react";
import { Nav } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import auth from "../../common/auth";
import "./Navbar.css";

class Navibar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: ""
    };
  }

  handleLogout = event => {
    //console.log(event.target.name);
    auth.logout();
  };

  renderLogin() {
    return (
      <Nav className="linkslog">
        <Nav.Link name="login" href="/login">
          Login
        </Nav.Link>
        <Nav.Link name="register" href="/register">
          Register
        </Nav.Link>
      </Nav>
    );
  }

  renderLogout() {
    return (
      <Nav className="linkslog">
        <Nav.Link href="/profile">Profile{this.state.username}</Nav.Link>
        <Nav.Link name="logout" onSelect={this.handleLogout()}>
          Logout
        </Nav.Link>
      </Nav>
    );
  }

  setLoginRender() {
    let login;
    !auth.user.logged
      ? (login = this.renderLogin())
      : (login = this.renderLogout());
    return login;
  }

  render() {
    return (
      <Navbar expand="lg" className="navbar">
        <Navbar.Brand href="/">WikiFlight</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link className="links" href="/aircrafts">
            Aircraft List
          </Nav.Link>
        </Nav>
        {this.setLoginRender()}
      </Navbar>
    );
  }
}

export default Navibar;
