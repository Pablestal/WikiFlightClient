import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";

class ResetPass extends Component {
  state = { password: "", repassword: "", token: "" };

  handleSubmit = event => {};

  handleInputChange = event => {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  render() {
    return (
      <div>
        <Form className="form" onSubmit={this.handleSubmit}>
          <h2 className="tittle">Password reset</h2>
          <h4 className="recsubtittle">
            Enter your new password twice to reset your password.
          </h4>
          <hr />

          <Form.Group className="m-3">
            <Form.Label className="recLabel">New password</Form.Label>
            <Form.Control
              placeholder="Password"
              name="password"
              type="password"
              onChange={this.handleInputChange}
            />
          </Form.Group>
          <Form.Group className="m-3">
            <Form.Label className="recLabel">Repeat new password</Form.Label>
            <Form.Control
              placeholder="Password"
              name="repassword"
              type="password"
              onChange={this.handleInputChange}
            />
          </Form.Group>

          <Button className="btn m-3" variant="new" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}

export default ResetPass;
