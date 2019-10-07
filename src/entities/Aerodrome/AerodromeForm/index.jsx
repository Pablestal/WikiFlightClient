import React, { Component } from "react";

import { Form, Row, Col, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { HTTP } from "../../../common/http-common";
import { withRouter } from "react-router-dom";
import { notify } from "react-notify-toast";
import { Map, TileLayer, Marker } from "react-leaflet";

class AerodromeForm extends Component {
  state = {
    aerodrome: "",
    lat: 51.505,
    lng: -0.09,
    zoom: 13
  };

  componentDidMount() {
    const aerodrome = this.props.location.state.selected;
    this.setState({ aerodrome: aerodrome });
  }

  handleInputChange = event => {
    event.preventDefault();
    this.setState({
      aerodrome: {
        ...this.state.aerodrome,
        [event.target.name]: event.target.value,
        position: {
          ...this.state.aerodrome.position,
          [event.target.name]: event.target.value
        }
      }
    });
  };

  handleSubmitEdit = event => {
    event.preventDefault();
    const aerodrome = this.state.aerodrome;
    const {
      history: { push }
    } = this.props;
    HTTP.put(`aerodromes/${aerodrome.id}`, aerodrome)
      .then(function(response) {
        notify.show("Successfully modified", "success", 3000);
        push("/aerodromes");
      })
      .catch(function(error) {
        notify.show("This aerodrome already exists.", "error", 3000);
      });
  };

  handleSubmitNew = event => {
    event.preventDefault();
    const aerodrome = this.state.aerodrome;
    const {
      history: { push }
    } = this.props;
    HTTP.post(`/aerodromes`, aerodrome)
      .then(function(response) {
        notify.show("Successfully modified", "success", 3000);
        push("/aerodromes");
      })
      .catch(function(error) {
        notify.show("This aerodrome already exists.", "error", 3000);
      });
  };

  renderEdit(aerodrome) {
    let pos;
    let position;
    !this.state.aerodrome.position
      ? (pos = "Loading...")
      : (pos = this.state.aerodrome.position);
    pos === "Loading..." ? (position = [0, 0]) : (position = [pos.x, pos.y]);

    return (
      <div className="container">
        <h2 className="tittle">
          Edit aerodrome of {aerodrome.city} ({aerodrome.name})
        </h2>
        <hr />
        <Form onSubmit={this.handleSubmitEdit}>
          {/* Primera columna (Name, City, Country) */}
          <Row>
            <Col>
              <Form.Group className="m-3" as={Row} controlId="formGridName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  defaultValue={aerodrome.name}
                  name="name"
                  onChange={this.handleInputChange}
                />
              </Form.Group>
              <Form.Group className="m-3" as={Row} controlId="formGridCountry">
                <Form.Label>Country</Form.Label>
                <Form.Control
                  defaultValue={aerodrome.country}
                  name="country"
                  onChange={this.handleInputChange}
                />
              </Form.Group>
              <Form.Group className="m-3" as={Row} controlId="formGridCity">
                <Form.Label>City</Form.Label>
                <Form.Control
                  defaultValue={aerodrome.city}
                  name="city"
                  onChange={this.handleInputChange}
                />
              </Form.Group>
            </Col>
            {/* Segunda columna (MAPA) */}
            <Col>
              <Map
                center={position}
                zoom={this.state.zoom}
                className="map_aerod"
              >
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}></Marker>
              </Map>
            </Col>
          </Row>
          {/* Fila de abajo (IATA, OACI, Elevación, Coordenadas(X, Y)) */}
          <Row>
            <Form.Group className="m-3" as={Col} controlId="formGridIATA">
              <Form.Label>IATA</Form.Label>
              <Form.Control
                defaultValue={aerodrome.codIATA}
                name="codIATA"
                onChange={this.handleInputChange}
              />
            </Form.Group>
            <Form.Group className="m-3" as={Col} controlId="formGridOACI">
              <Form.Label>OACI</Form.Label>
              <Form.Control
                defaultValue={aerodrome.codOACI}
                name="codOACI"
                onChange={this.handleInputChange}
              />
            </Form.Group>
            <Form.Group className="m-3" as={Col} controlId="formGridElevation">
              <Form.Label>Elevation (ft)</Form.Label>
              <Form.Control
                defaultValue={aerodrome.elevation}
                name="elevation"
                onChange={this.handleInputChange}
              />
            </Form.Group>
            <Form.Group className="m-3" as={Col} controlId="formGridX">
              <Form.Label>Latitude:</Form.Label>
              <Form.Control
                placeholder="X"
                defaultValue={pos.x}
                name="x"
                onChange={this.handleInputChange}
              />
            </Form.Group>

            <Form.Group className="m-3" as={Col} controlId="formGridY">
              <Form.Label>Longitude:</Form.Label>
              <Form.Control
                placeholder="Y"
                defaultValue={pos.y}
                name="y"
                onChange={this.handleInputChange}
              />
            </Form.Group>
          </Row>
          <Button className="btn m-3" variant="new" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    );
  }

  renderNew() {
    return (
      <div className="container">
        <h2 className="tittle">Create new aerodrome</h2>
        <hr />
        <Form className="innerform" onSubmit={this.handleSubmitNew}>
          {/* Primera columna (Name, City, Country) */}
          <Col>
            <Form.Group className="m-3" as={Row} controlId="formGridName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                placeholder="Name"
                name="name"
                onChange={this.handleInputChange}
              />
            </Form.Group>
            <Form.Group className="m-3" as={Row} controlId="formGridCountry">
              <Form.Label>Country</Form.Label>
              <Form.Control
                placeholder="Country"
                name="country"
                onChange={this.handleInputChange}
              />
            </Form.Group>
            <Form.Group className="m-3" as={Row} controlId="formGridCity">
              <Form.Label>City</Form.Label>
              <Form.Control
                placeholder="City"
                name="city"
                onChange={this.handleInputChange}
              />
            </Form.Group>
          </Col>
          {/* Segunda columna (MAPA) */}
          <Col></Col>
          {/* Fila de abajo (IATA, OACI, Elevación, Coordenadas(X, Y)) */}
          <Row>
            <Form.Group className="m-3" as={Col} controlId="formGridIATA">
              <Form.Label>IATA</Form.Label>
              <Form.Control
                placeholder="IATA code"
                name="codIATA"
                onChange={this.handleInputChange}
              />
            </Form.Group>
            <Form.Group className="m-3" as={Col} controlId="formGridOACI">
              <Form.Label>OACI</Form.Label>
              <Form.Control
                placeholder="OACI code"
                name="codOACI"
                onChange={this.handleInputChange}
              />
            </Form.Group>
            <Form.Group className="m-3" as={Col} controlId="formGridElevation">
              <Form.Label>Elevation (ft)</Form.Label>
              <Form.Control
                placeholder="Elevation"
                name="elevation"
                onChange={this.handleInputChange}
              />
            </Form.Group>
            <Form.Group className="m-3" as={Col} controlId="formGridX">
              <Form.Label>X:</Form.Label>
              <Form.Control
                placeholder="X value"
                name="x"
                onChange={this.handleInputChange}
              />
            </Form.Group>

            <Form.Group className="m-3" as={Col} controlId="formGridY">
              <Form.Label>Y:</Form.Label>
              <Form.Control
                placeholder="Y value"
                name="y"
                onChange={this.handleInputChange}
              />
            </Form.Group>
          </Row>
          <Button className="btn m-3" variant="new" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    );
  }

  render() {
    const aerodrome = this.props.location.state.selected;

    return aerodrome !== "" ? this.renderEdit(aerodrome) : this.renderNew();
  }
}

export default connect(withRouter)(AerodromeForm);
