import React, { Component } from "react";
import Navbar from "./Navbar";
import Content from "./Content";
import PropTypes from "prop-types";
import "../App.css";
import Notifications from "react-notify-toast";
import { connect } from "react-redux";

class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired
  };

  render() {
    const { children } = this.props;

    return (
      <div className="App">
        <header className="App-header">
          <Navbar />
        </header>
        <Notifications />
        <Content body={children} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    authority: state.auth.authority
  };
}

export default connect(mapStateToProps)(App);
