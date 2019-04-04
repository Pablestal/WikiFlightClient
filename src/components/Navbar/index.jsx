import React from "react";
import { Nav } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import { connect } from "react-redux";
import { signOutAction } from "../../redux/creators";
import "./Navbar.css";

class Navibar extends React.Component {
  handleLogout = event => {
    this.props.signOutAction();
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
        <Nav.Link href="/profile">'s profile</Nav.Link>
        <Nav.Link onClick={this.handleLogout} name="logout">
          Logout
        </Nav.Link>
      </Nav>
    );
  }

  setLoginRender() {
    let login;
    this.props.authenticated
      ? (login = this.renderLogout())
      : (login = this.renderLogin());
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

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated
  };
}

export default connect(
  mapStateToProps,
  { signOutAction }
)(Navibar);
