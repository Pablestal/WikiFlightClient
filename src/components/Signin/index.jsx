import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { signInAction } from "../../redux/actions";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Form, Button } from "react-bootstrap";

import "./Signin.css";

class Signin extends Component {
  submit = values => {
    this.props.signInAction(values, this.props.history);
  };

  render() {
    const { handleSubmit } = this.props;
    return (
      <div className="container">
        <Form onSubmit={handleSubmit(this.submit)}>
          <h2 className="tittle">Sign in</h2>
          <hr />
          <div className="innerform">
            <Form.Group className="m-3">
              <Form.Label>Username</Form.Label>
              <Field
                className="myfield"
                name="login"
                component="input"
                type="text"
                placeholder="Username"
              />
            </Form.Group>

            <Form.Group className="m-3">
              <Form.Label>Password</Form.Label>
              <Field
                className="myfield"
                name="password"
                component="input"
                type="password"
                placeholder="Password"
              />
            </Form.Group>
            {/* {this.errorMessage()} */}
            <div>
              <Button className="btn m-3" variant="new" type="submit">
                Sign in
              </Button>

              <Link to="/forgotPassword" className="forgotp">
                Forgot your password?
              </Link>
              <Button className="regbutton" variant="new" href="/register">
                Register
              </Button>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { errorMessage: state.auth.error };
}

const reduxFormSignin = reduxForm({
  form: "signin",
  onSubmit: signInAction
})(Signin);

export default connect(
  mapStateToProps,
  { signInAction }
)(reduxFormSignin);
