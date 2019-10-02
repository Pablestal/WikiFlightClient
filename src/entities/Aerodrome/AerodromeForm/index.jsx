import React, { Component } from "react";

import { Form, Button } from "react-bootstrap";
//import { HTTP } from "../../../common/http-common";
//import { withRouter } from "react-router-dom";
//import { notify } from "react-notify-toast";

class AerodromeForm extends Component {
  state = {};
  render() {
    return (
      <div className="content">
        <Form className="form" onSubmit={this.handleSubmitEdit}>
          <h2 className="tittle">
            Edit {this.state.manufacturer} {this.state.model}
          </h2>
          <hr />
          <Form.Group className="m-3">
            <Form.Label>Edit Manufacturer</Form.Label>
            <Form.Control
              defaultValue={this.state.manufacturer}
              name="manufacturer"
              onChange={this.handleInputChange}
            />
          </Form.Group>
          <Form.Group className="m-3">
            <Form.Label>Edit Model</Form.Label>
            <Form.Control
              defaultValue={this.state.model}
              name="model"
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

export default AerodromeForm;
