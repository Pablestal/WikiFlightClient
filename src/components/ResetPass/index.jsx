import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";
import { HTTP } from "../../common/http-common";
import { withRouter } from "react-router-dom";
import { notify } from "react-notify-toast";

class ResetPass extends Component {
  state = { password: "", repassword: "", token: "" };

  handleSubmit = event => {
    event.preventDefault();
    const {
      history: { push }
    } = this.props;
    this.state.password === this.state.repassword
      ? HTTP.put(`resetpassword/${this.props.match.params.token}`, {
          password: this.state.password
        })
          .then(function(response) {
            notify.show("Successfully modified", "success", 3000);
            push("/login");
          })
          .catch(function(error) {
            notify.show(
              "An error has occurred, please try again",
              "error",
              3000
            );
          })
      : notify.show("Password must be the same in both fields", "error", 3000);
  };

  handleInputChange = event => {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  render() {
    return (
      <div className="container">
        <Form className="innerform" onSubmit={this.handleSubmit}>
          <h2 className="tittle">Password reset</h2>
          <h4 className="recsubtittle">
            Enter your new password twice to reset your password.
          </h4>
          <hr />

          <Form.Group className="m-3">
            <Form.Label className="recLabel">New password</Form.Label>
            <Form.Control
              required
              placeholder="Password"
              name="password"
              type="password"
              onChange={this.handleInputChange}
            />
          </Form.Group>
          <Form.Group className="m-3">
            <Form.Label className="recLabel">Repeat new password</Form.Label>
            <Form.Control
              required
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

export default withRouter(ResetPass);
