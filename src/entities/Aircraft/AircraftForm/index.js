import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";
import "./AircraftForm.css";
import { HTTP } from "../../../common/http-common";

class AircraftForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      manufacturer: "",
      model: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit = event => {
    event.preventDefault();

    HTTP.post("/aircrafts/id", {
      manufacturer: this.state.manufacturer,
      model: this.state.model
    })
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  handleInputChange = event => {
    event.preventDefault();
    console.log(event);
    console.log(event.target.name);
    console.log(event.target.value);
    this.setState({
      [event.target.name]: event.target.value
    });
    console.log(this.state.manufacturer);
    console.log(this.state.model);
  };

  render() {
    const manufacturer = this.state.manufacturer;

    return (
      <div>
        <p>Manufacturer: {manufacturer}</p>
        <p>Model: {this.state.model}</p>
        <Form className="form" onSubmit={this.handleSubmit}>
          <Form.Label>Manufacturer</Form.Label>
          <Form.Control
            placeholder="Enter manufacturer"
            name="manufacturer"
            onChange={this.handleInputChange}
          />
          <Form.Label>Model</Form.Label>
          <Form.Control
            placeholder="Enter model"
            name="model"
            onChange={this.handleInputChange}
          />
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}

export default AircraftForm;
