import React, { Component } from "react";
import auth from "../../common/auth";

class Home extends Component {
  render() {
    return <h1>HOME PAGE of {auth.user.login}</h1>;
  }
}

export default Home;
