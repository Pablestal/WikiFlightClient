import React, { Component } from "react";
import { Button, Form } from "react-bootstrap";
import auth from "../../common/auth";
import { withRouter } from "react-router";

import "./Login.css";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userName: "",
      password: "",
      error: null
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    const {
      history: { push }
    } = this.props;

    auth
      .login({
        login: this.state.userName,
        password: this.state.password
      })
      .then(function(response) {
        console.log(response);
        push("/");
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  render() {
    return (
      <div className="Login">
        <form onSubmit={this.handleSubmit}>
          <Form.Group controlId="userName">
            <Form.Label>Username</Form.Label>
            <Form.Control
              autoFocus
              value={this.state.userName}
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </Form.Group>
          <Button block type="submit">
            Login
          </Button>
        </form>
      </div>
    );
  }
}

export default withRouter(Login);
