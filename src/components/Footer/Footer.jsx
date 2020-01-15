import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

class Footer extends React.Component {
  render() {
    return (
      <div className="root">
        <div>
          <span className="text">© Your Company</span>
          <span className="spacer">·</span>
          <Link className="link" to="/">
            Home
          </Link>
          <span className="spacer">·</span>
          <Link className="link" to="/admin">
            Admin
          </Link>
          <span className="spacer">·</span>
          <Link className="link" to="/privacy">
            Privacy
          </Link>
          <span className="spacer">·</span>
          <Link className="link" to="/not-found">
            Not Found
          </Link>
        </div>
      </div>
    );
  }
}

export default Footer;
