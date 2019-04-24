import React from "react";
import { Nav } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import { connect } from "react-redux";
import { signOutAction } from "../../redux/actions";
import history from "../../history";

import "./Navbar.css";

class Navibar extends React.Component {
  handleLogout = event => {
    this.props.signOutAction();
    history.push("/");
  };

  renderLogin() {
    return (
      <Nav className="linkslog">
        <Nav.Link name="login" href="/login">
          Login
        </Nav.Link>
        <h2 className="separator">|</h2>
        <Nav.Link name="register" href="/register">
          Register
        </Nav.Link>
      </Nav>
    );
  }

  renderLogout() {
    return (
      <Nav className="linkslog">
        <Nav.Link href="/profile">{this.props.login}'s profile</Nav.Link>
        <h2 className="separator">|</h2>
        <Nav.Link onClick={this.handleLogout} name="logout">
          Logout
        </Nav.Link>
      </Nav>
    );
  }

  setLoginRender() {
    // console.log(this.props.authenticated);
    // console.log(this.props.login);
    let login;
    this.props.authenticated
      ? (login = this.renderLogout())
      : (login = this.renderLogin());
    return login;
  }

  render() {
    //console.log(this.props);
    return (
      <Navbar expand="lg" className="navbar">
        <Navbar.Brand className="brand" href="/">
          WikiFlight
        </Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link className="links" href="/aircrafts">
            Aircrafts
          </Nav.Link>
          <Nav.Link className="links" href="/aerodromes">
            Aerodromes
          </Nav.Link>
        </Nav>
        <div className="log">{this.setLoginRender()}</div>
      </Navbar>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    login: state.auth.login,
    authority: state.auth.authority
  };
}

export default connect(
  mapStateToProps,
  { signOutAction }
)(Navibar);
