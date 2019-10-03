import React, { Component } from "react";

import { Form, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { HTTP } from "../../../common/http-common";
import { withRouter } from "react-router-dom";
import { notify } from "react-notify-toast";

class AerodromeForm extends Component {
  state = { aerodrome: "" };

  componentDidMount() {
    const aerodrome = this.props.location.state.selected;
    this.setState({ aerodrome: aerodrome });
  }

  handleInputChange = event => {
    event.preventDefault();

    this.setState({
      aerodrome: {
        ...this.state.todoList,
        [event.target.name]: event.target.value
      }
    });
    this.setState({ [event.target.name]: event.target.value });
    console.log(this.state.aerodrome);
  };

  handleSubmitEdit = event => {
    event.preventDefault();
    const aerodrome = this.state.aerodrome;
    const {
      history: { push }
    } = this.props;
    console.log(aerodrome);
    HTTP.put(`aerodromes/${aerodrome.id}`, aerodrome)
      .then(function(response) {
        notify.show("Successfully modified", "success", 3000);
        push("/aerodromes");
      })
      .catch(function(error) {
        notify.show("This aerodrome already exists.", "error", 3000);
      });
  };

  renderEdit(aerodrome) {
    return (
      <div className="container">
        <Form onSubmit={this.handleSubmitEdit}>
          <h2 className="tittle">
            Edit aerodrome of {aerodrome.city} ({aerodrome.name})
          </h2>
          <hr />
          <div className="innerform">
            <Form.Group className="m-3">
              <Form.Label>Edit Name</Form.Label>
              <Form.Control
                defaultValue={aerodrome.name}
                name="name"
                onChange={this.handleInputChange}
              />
            </Form.Group>
            <Form.Group className="m-3">
              <Form.Label>Edit City</Form.Label>
              <Form.Control
                defaultValue={aerodrome.city}
                name="city"
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

  renderNew() {
    return (
      <div className="container">
        <Form onSubmit={this.handleSubmitNew}>
          <h2 className="tittle">Create new aerodrome</h2>
          <hr />
          <div className="innerform">
            <Form.Group className="m-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                placeholder="Enter name"
                name="name"
                onChange={this.handleInputChange}
              />
            </Form.Group>
            <Form.Group className="m-3">
              <Form.Label>City</Form.Label>
              <Form.Control
                placeholder="Enter city"
                name="city"
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

  render() {
    const aerodrome = this.state.aerodrome;
    return this.props.selected ? this.renderEdit(aerodrome) : this.renderNew();
  }
}

function mapStateToProps(state) {
  return { selected: state.aerod.selected };
}

export default connect(
  mapStateToProps,
  withRouter
)(AerodromeForm);
