import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";
import "./RestorePass.css";

class PassRecovery extends Component {
  handleSubmit() {
    console.log("Email sent");
  }

  render() {
    return (
      <div>
        <Form className="form" onSubmit={this.handleSubmit}>
          <h2 className="tittle">Password recovery</h2>
          <h4 className="recsubtittle">
            Enter your email and we will send you instructions to reset your
            password
          </h4>
          <hr />

          <Form.Group className="m-3">
            <Form.Label className="recLabel">Enter your email</Form.Label>
            <Form.Control placeholder="Email" name="email" />
          </Form.Group>

          <Button className="btn m-3" variant="new" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}

export default PassRecovery;
