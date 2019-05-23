import React, { Component } from "react";
import "./Page404.css";
import crash from "../../common/images/crash.png";

class Page404 extends Component {
  render() {
    return (
      <div className="nfound">
        <h1> 404 Page Not Found </h1>
        <h3>The page you are trying to access does not exist.</h3>
        <img className="crash" src={crash} alt="crash" />
      </div>
    );
  }
}

export default Page404;
