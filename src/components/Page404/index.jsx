import React, { Component } from "react";
import "./Page404.css";

class Page404 extends Component {
  render() {
    return (
      <div className="nfound">
        <h1>Oops! 404 Page Not Found </h1>
        <h3>The page you are trying to access does not exist.</h3>
        <img className="crash" src="/images/crash.png" alt="crash" />
      </div>
    );
  }
}

export default Page404;
