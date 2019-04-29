import React, { Component } from "react";
import { Form, Col, Button } from "react-bootstrap";
import { HTTP } from "../../common/http-common";
import history from "../../history";
import { notify } from "react-notify-toast";
import { withRouter } from "react-router";
import "./Register.css";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      surame1: "",
      surname2: "",
      login: "",
      email: "",
      password: "",
      country: "",
      birthDate: "",
      city: ""
    };
  }

  handleInputChange = event => {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    HTTP.post("register", {
      name: this.state.name,
      surname1: this.state.surname1,
      surname2: this.state.surname2,
      login: this.state.login,
      email: this.state.email,
      password: this.state.password,
      country: this.state.country,
      city: this.state.city,
      birthDate: this.state.birthDate
    })
      .then(function(response) {
        console.log(response);
        notify.show("Successfully registered, you may log in.", "success");
        history.push("/login");
      })
      .catch(err => (this.error = notify.show("Error", "error")));
  };

  render() {
    return (
      <div className="container">
        <h2 className="tittle">SIGN UP PAGE</h2>
        <hr />
        <Form className="m-5" onSubmit={this.handleSubmit}>
          <Form.Row>
            <Form.Group as={Col} controlId="formGridName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                placeholder="Name"
                name="name"
                onChange={this.handleInputChange}
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridSurname1">
              <Form.Label>Surname</Form.Label>
              <Form.Control
                placeholder="Surname"
                name="surname1"
                onChange={this.handleInputChange}
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridSurname2">
              <Form.Label>Surname 2 (optional)</Form.Label>
              <Form.Control
                placeholder="Surname"
                name="surname2"
                onChange={this.handleInputChange}
              />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col} controlId="formGridUserName">
              <Form.Label>Username</Form.Label>
              <Form.Control
                placeholder="Username"
                name="login"
                onChange={this.handleInputChange}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                name="email"
                onChange={this.handleInputChange}
              />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col} controlId="formGridPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                onChange={this.handleInputChange}
              />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col} controlId="formGridCountry">
              <Form.Label>Country</Form.Label>
              <Form.Control
                placeholder="Country"
                name="country"
                onChange={this.handleInputChange}
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridCity">
              <Form.Label>City</Form.Label>
              <Form.Control
                placeholder="City"
                name="city"
                onChange={this.handleInputChange}
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridBirthDate">
              <Form.Label>Birth date</Form.Label>
              <Form.Control
                type="date"
                name="birthDate"
                onChange={this.handleInputChange}
              />
            </Form.Group>
          </Form.Row>

          <Form.Row />

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}

export default withRouter(Register);
