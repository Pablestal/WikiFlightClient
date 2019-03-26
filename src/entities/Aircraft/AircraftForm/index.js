import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";
import "./AircraftForm.css";
import { HTTP } from "../../../common/http-common";
import { withRouter } from "react-router-dom";
import { notify } from "react-notify-toast";

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
    const {
      history: { push }
    } = this.props;

    HTTP.post("/aircrafts/id", {
      manufacturer: this.state.manufacturer,
      model: this.state.model
    })
      .then(function(response) {
        console.log(response);
        notify.show("Successfully added", "success", 3000);
        push("/aircrafts");
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  handleInputChange = event => {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value
    });
  };
  //Ejemplo para comprobar event
  // handleInputChange = event => {
  //   event.preventDefault();
  //   console.log(event);
  //   console.log(event.target.name);
  //   console.log(event.target.value);
  //   this.setState({
  //     [event.target.name]: event.target.value
  //   });
  //   console.log(this.state.manufacturer);
  //   console.log(this.state.model);
  // };

  render() {
    return (
      <div>
        {/* <p>Manufacturer: {manufacturer}</p>
        <p>Model: {this.state.model}</p> */}
        <Form className="form" onSubmit={this.handleSubmit}>
          <Form.Group className="m-3">
            <Form.Label>Manufacturer</Form.Label>
            <Form.Control
              placeholder="Enter manufacturer"
              name="manufacturer"
              onChange={this.handleInputChange}
            />
          </Form.Group>
          <Form.Group className="m-3">
            <Form.Label>Model</Form.Label>
            <Form.Control
              placeholder="Enter model"
              name="model"
              onChange={this.handleInputChange}
            />
          </Form.Group>
          <Button className="btn m-3" variant="primary" type="submit">
            Submit
          </Button>
          <Button
            className="btn m-3"
            variant="primary"
            onClick={this.handlePush}
          >
            Push
          </Button>
        </Form>
      </div>
    );
  }
}

export default withRouter(AircraftForm);
