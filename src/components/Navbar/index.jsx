import React from "react";

import { Nav } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import { connect } from "react-redux";
import { signOutAction } from "../../redux/actions";
import history from "../../history";
import { Link } from "react-router-dom";

import "./Navbar.css";

class Navibar extends React.Component {
  // ADMIN NAVBAR //

  renderAdmin() {
    return (
      <Nav className="linkslog">
        <Nav.Link onClick={this.handleLogout} name="logout">
          Logout
        </Nav.Link>
      </Nav>
    );
  }

  adminLogRender() {
    return (
      <Nav className="mr-auto">
        <Link className="navlinks" to="/aircrafts">
          Aircrafts
        </Link>
        <Link className="navlinks" to="/aerodromes">
          Aerodromes
        </Link>
        <Link className="navlinks" to="/routes">
          Routes
        </Link>
      </Nav>
    );
  }

  // PILOT NAVBAR //

  renderPilot() {
    return (
      <Nav className="linkslog">
        <Link className="navlinks" to={`/profile/${this.props.login}`}>
          {this.props.login}'s profile
        </Link>
        <h2 className="separator">|</h2>
        <Nav.Link onClick={this.handleLogout} name="logout">
          Logout
        </Nav.Link>
      </Nav>
    );
  }

  pilotLogRender() {
    return (
      <Nav className="mr-auto">
        <Link className="navlinks" to={`/myLogbook`}>
          My Logbook
        </Link>
      </Nav>
    );
  }

  // ANONYMOUS NAVBAR //

  anonymousLogRender() {
    return (
      <Nav className="linkslog">
        <Link className="navlinks" name="login" to="/login">
          Sign in
        </Link>
        <h2 className="separator">|</h2>
        <Link className="navlinks" name="register" to="/register">
          Register
        </Link>
      </Nav>
    );
  }

  anonymousRender() {}

  renderLogout() {
    let logout;
    this.props.authority === "ADMIN"
      ? (logout = this.renderAdmin())
      : (logout = this.renderPilot());
    return logout;
  }

  setLoginRender() {
    let login;
    this.props.authenticated
      ? (login = this.renderLogout())
      : (login = this.anonymousLogRender());
    return login;
  }

  setUserRender() {
    let links;
    !this.props.authenticated
      ? (links = this.anonymousRender())
      : this.props.authority === "ADMIN"
      ? (links = this.adminLogRender())
      : this.props.authority === "PILOT"
      ? (links = this.pilotLogRender())
      : (links = null);

    return links;
  }

  handleLogout = event => {
    this.props.signOutAction();
    history.push("/");
  };

  render() {
    return (
      <Navbar expand="lg" className="navbar">
        <Link className="brand" to="/">
          WikiFlight
        </Link>
        <Nav className="mr-auto">{this.setUserRender()}</Nav>
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
