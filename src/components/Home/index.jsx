import React, { Component } from "react";
import { connect } from "react-redux";
import HomeAdmin from "./HomeAdmin";
import HomePilot from "./HomePilot";
import HomeAnonymous from "./HomeAnonymous";

class Home extends Component {
  renderIf() {
    if (!this.props.authenticated) {
      return <HomeAnonymous />;
    } else if (this.props.authority === "ADMIN") {
      return <HomeAdmin />;
    } else return <HomePilot />;
  }

  render() {
    return <div className="container">{this.renderIf()}</div>;
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    login: state.auth.login,
    authority: state.auth.authority
  };
}

export default connect(mapStateToProps)(Home);
