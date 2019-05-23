import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { signInAction } from "../../redux/actions";
//import { Link } from "react-router-dom";
import { connect } from "react-redux";
import "./Signin.css";
import Collapse, { Panel } from "rc-collapse";

class Signin extends Component {
  submit = values => {
    this.props.signInAction(values, this.props.history);
  };

  errorMessage() {
    if (this.props.errorMessage) {
      return <div className="info-red">{this.props.errorMessage}</div>;
    }
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <div>
        <form onSubmit={handleSubmit(this.submit)} className="formu">
          <div>
            <div className="inputf">
              <Field
                name="login"
                component="input"
                type="text"
                placeholder="Username"
              />
            </div>
          </div>
          <div>
            <div className="inputf">
              <Field
                name="password"
                component="input"
                type="password"
                placeholder="Password"
              />
            </div>
          </div>
          <div>
            <button className="bsignin" type="submit">
              Sign in
            </button>
            {this.errorMessage()}
          </div>
        </form>
        <Collapse accordion={true} className="formupass">
          <Panel header="Forgot your password?" showArrow>
            <form className="panelpass">
              <input type="text" name="email" />
              <button className="bsignin" type="submit">
                Send email
              </button>
            </form>
          </Panel>
        </Collapse>
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
