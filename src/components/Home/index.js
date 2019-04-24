import React, { Component } from "react";
import { connect } from "react-redux";

class Home extends Component {
  renderIf() {
    return this.props.authenticated ? (
      <h1>
        of {this.props.login} as {this.props.authority}
      </h1>
    ) : (
      <h1>User is not authenticated.</h1>
    );
  }

  render() {
    return (
      <div>
        <h1>
          HOME PAGE <span>{this.renderIf()}</span>
        </h1>
      </div>
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

export default connect(mapStateToProps)(Home);
