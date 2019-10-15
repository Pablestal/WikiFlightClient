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
    this.handleSubmitNew = this.handleSubmitNew.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  goBack() {
    this.props.history.goBack();
  }

  componentDidMount() {
    if (this.props.match.params.id)
      return HTTP.get(`/aircrafts/${this.props.match.params.id}`)
        .then(response => {
          this.setState({
            manufacturer: response.data.manufacturer,
            model: response.data.model
          });
        })
        .catch(function(error) {
          console.log(error);
        });
  }

  handleSubmitNew = event => {
    event.preventDefault();
    const {
      history: { push }
    } = this.props;
    HTTP.post("/aircrafts", {
      manufacturer: this.state.manufacturer,
      model: this.state.model
    })
      .then(function(response) {
        notify.show("Successfully added", "success", 3000);
        push("/aircrafts");
      })
      .catch(function(error) {
        notify.show("This aircraft already exists.", "error", 3000);
      });
  };

  handleSubmitEdit = event => {
    event.preventDefault();
    const {
      history: { push }
    } = this.props;
    HTTP.put(`aircrafts/${this.props.match.params.id}`, {
      id: this.props.match.params.id,
      manufacturer: this.state.manufacturer,
      model: this.state.model
    })
      .then(function(response) {
        notify.show("Successfully modified", "success", 3000);
        push("/aircrafts");
      })
      .catch(function(error) {
        notify.show("This aircraft already exists.", "error", 3000);
      });
  };

  renderNew() {
    return (
      <div className="container">
        <Form onSubmit={this.handleSubmitNew}>
          <h2 className="tittle">
            Create new aircraft
            <Button variant="back" onClick={this.goBack}>
              Back
            </Button>
          </h2>
          <hr />
          <div className="innerform">
            <Form.Group className="m-3">
              <Form.Label>Manufacturer</Form.Label>
              <Form.Control
                required
                type="text"
                maxLength="20"
                placeholder="Enter manufacturer"
                name="manufacturer"
                onChange={this.handleInputChange}
              />
            </Form.Group>
            <Form.Group className="m-3">
              <Form.Label>Model</Form.Label>
              <Form.Control
                required
                maxLength="9"
                type="text"
                placeholder="Enter model"
                name="model"
                onChange={this.handleInputChange}
              />
            </Form.Group>
            <Button className="btn m-3" variant="new" type="submit">
              Submit
            </Button>
          </div>
        </Form>
      </div>
    );
  }

  renderEdit() {
    return (
      <div className="container">
        <Form onSubmit={this.handleSubmitEdit}>
          <h2 className="tittle">
            Edit {this.state.manufacturer} {this.state.model}
            <Button variant="back" onClick={this.goBack}>
              Back
            </Button>
          </h2>
          <hr />
          <div className="innerform">
            <Form.Group className="m-3">
              <Form.Label>Edit Manufacturer</Form.Label>
              <Form.Control
                required
                maxLength="20"
                type="text"
                defaultValue={this.state.manufacturer}
                name="manufacturer"
                onChange={this.handleInputChange}
              />
            </Form.Group>
            <Form.Group className="m-3">
              <Form.Label>Edit Model</Form.Label>
              <Form.Control
                required
                type="text"
                maxLength="9"
                defaultValue={this.state.model}
                name="model"
                onChange={this.handleInputChange}
              />
            </Form.Group>
            <Button className="btn m-3" variant="new" type="submit">
              Save
            </Button>
          </div>
        </Form>
      </div>
    );
  }

  handleInputChange = event => {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  render() {
    return this.props.match.params.id ? this.renderEdit() : this.renderNew();
  }
}

export default withRouter(AircraftForm);
