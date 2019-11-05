import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";
import "./AircraftForm.css";
import { HTTP } from "../../../common/http-common";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { notify } from "react-notify-toast";

class AircraftForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      aircraft: {
        manufacturer: "",
        model: ""
      }
    };
    this.handleSubmitNew = this.handleSubmitNew.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  goBack() {
    this.props.history.goBack();
  }

  componentDidMount() {
    const aircraft = this.props.location.state.selected;
    aircraft
      ? this.setState({ aircraft: aircraft })
      : this.setState({ aircraft: { manufacturer: "", model: "" } });
  }

  handleSubmitNew = event => {
    event.preventDefault();
    const aircraft = this.state.aircraft;
    const {
      history: { push }
    } = this.props;
    HTTP.post("/aircrafts", aircraft)
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
    const aircraft = this.state.aircraft;
    const {
      history: { push }
    } = this.props;
    HTTP.put(`aircrafts/${aircraft.id}`, aircraft)
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
              <Form.Control.Feedback type="invalid">
                Please enter a valid manufacturer.
              </Form.Control.Feedback>
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

  renderEdit(aircraft) {
    return (
      <div className="container">
        <Form onSubmit={this.handleSubmitEdit}>
          <h2 className="tittle">
            Edit {aircraft.manufacturer} {aircraft.model}
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
                defaultValue={aircraft.manufacturer}
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
                defaultValue={aircraft.model}
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
      aircraft: {
        ...this.state.aircraft,
        [event.target.name]: event.target.value
      }
    });
  };

  render() {
    const aircraft = this.props.location.state.selected;
    return aircraft ? this.renderEdit(aircraft) : this.renderNew();
  }
}

export default connect(withRouter)(AircraftForm);
