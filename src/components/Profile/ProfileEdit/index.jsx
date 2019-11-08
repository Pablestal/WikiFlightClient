import React, { Component } from "react";

import { connect } from "react-redux";
import { HTTP } from "../../../common/http-common";
import { notify } from "react-notify-toast";
import { Button, Col, Form } from "react-bootstrap";

class ProfileEdit extends Component {
  constructor(props) {
    super(props);
    this.state = { pilot: "" };
  }

  componentDidMount() {
    HTTP.get(`users/${this.props.login}`)
      .then(res => {
        const pilot = res.data;
        this.setState({ pilot });
      })
      .catch(function(error) {
        notify.show("You are not allowed here", "error");
      });
  }

  handleSubmit = event => {
    event.preventDefault();
    const pilot = this.state.pilot;

    HTTP.put(`users/${pilot.login}`, pilot)
      .then(function(response) {
        notify.show("Successfully modified", "success", 3000);
      })
      .catch(function(error) {
        notify.show("Can't modify.", "error", 3000);
      });
  };

  handleInputChange = event => {
    event.preventDefault();
    this.setState({
      pilot: {
        ...this.state.pilot,
        [event.target.name]: event.target.value
      }
    });
  };

  render() {
    const pilot = this.state.pilot;
    return (
      <Form className="innerform" onSubmit={this.handleSubmit}>
        <h4 className="tittle">Modify personal data</h4>

        <Form.Row>
          <Form.Group as={Col} controlId="formGridName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              required
              defaultValue={pilot.name}
              type="text"
              placeholder="Name"
              name="name"
              onChange={this.handleInputChange}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridSurname1">
            <Form.Label>Surname</Form.Label>
            <Form.Control
              required
              defaultValue={pilot.surname1}
              type="text"
              placeholder="Surname"
              name="surname1"
              onChange={this.handleInputChange}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridSurname2">
            <Form.Label>Surname 2 (optional)</Form.Label>
            <Form.Control
              defaultValue={pilot.surname2}
              type="text"
              placeholder="Surname"
              name="surname2"
              onChange={this.handleInputChange}
            />
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              required
              defaultValue={pilot.email}
              type="email"
              placeholder="Email"
              name="email"
              onChange={this.handleInputChange}
            />
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group as={Col} controlId="formGridCountry">
            <Form.Label>Country</Form.Label>
            <Form.Control
              required
              defaultValue={pilot.country}
              type="text"
              placeholder="Country"
              name="country"
              onChange={this.handleInputChange}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridCity">
            <Form.Label>City</Form.Label>
            <Form.Control
              required
              defaultValue={pilot.city}
              type="text"
              placeholder="City"
              name="city"
              onChange={this.handleInputChange}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridBirthDate">
            <Form.Label>Birth date</Form.Label>
            <Form.Control
              required
              defaultValue={pilot.birthDate}
              type="date"
              name="birthDate"
              onChange={this.handleInputChange}
            />
          </Form.Group>
        </Form.Row>
        <h4 className="tittle">Modify password</h4>
        <Form.Row>
          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>New password</Form.Label>
            <Form.Control
              defaultValue={pilot.password}
              type="password"
              placeholder="New password"
              name="password"
              onChange={this.handleInputChange}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} controlId="formGridRepPassword">
            <Form.Label>Confirm new password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm new password"
              name="repPassword"
              onChange={this.handleInputChange}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row />

        <Button variant="submit" type="submit">
          Save changes
        </Button>
      </Form>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    login: state.auth.login,
    authority: state.auth.authority
  };
}

export default connect(mapStateToProps)(ProfileEdit);
