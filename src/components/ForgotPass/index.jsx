import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";
import { HTTP } from "../../common/http-common";
import { notify } from "react-notify-toast";
// import Loader from "react-loader-spinner";
import "./RestorePass.css";

class PassRecovery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      loading: 0
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    this.setState({ loading: 1 });
    const {
      history: { push }
    } = this.props;
    HTTP.post("/forgotpassword", {
      email: this.state.email
    })
      .then(function(response) {
        notify.show("Successfully sent", "success", 3000);
        this.setState({ loading: 0 });
        push("/login");
      })
      .catch(function(error) {
        notify.show("This email is not in our database.", "error", 3000);
      });
  };

  // renderLoading() {
  //   let load;
  //   this.state.loading === 0
  //     ? (load = <Loader type="Plane" color="#7a6344" height={80} width={80} />)
  //     : (load = (
  //         <Button className="btn m-3" variant="new" type="submit">
  //           Submit
  //         </Button>
  //       ));
  //   return load;
  // }

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
          <h2 className="tittle">Password recovery</h2>
          <h4 className="recsubtittle">
            Enter your email and we will send you instructions to reset your
            password.
          </h4>
          <hr />

          <Form.Group className="m-3">
            <Form.Label className="recLabel">Enter your email</Form.Label>
            <Form.Control
              placeholder="Email"
              name="email"
              onChange={this.handleInputChange}
            />
          </Form.Group>
          {/* {this.renderLoading} */}
          <Button className="btn m-3" variant="new" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}

export default PassRecovery;
