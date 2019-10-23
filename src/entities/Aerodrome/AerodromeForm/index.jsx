import React, { Component } from "react";

import { Form, Row, Col, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { HTTP } from "../../../common/http-common";
import { withRouter } from "react-router-dom";
import { notify } from "react-notify-toast";
import { Map, TileLayer, Marker } from "react-leaflet";

class AerodromeForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      aerodrome: {
        name: "",
        city: "",
        country: "",
        codIATA: "",
        codOACI: "",
        elevation: "",
        position: {
          type: "Point",
          coordinates: [-8.33, 43.33]
        }
      },
      zoom: 13
    };
    this.handleClick = this.handleClick.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  goBack() {
    this.props.history.goBack();
  }

  componentDidMount() {
    const aerodrome = this.props.location.state.selected;
    aerodrome
      ? this.setState({ aerodrome: aerodrome })
      : this.setState({
          aerodrome: {
            name: "",
            city: "",
            country: "",
            codIATA: "",
            codOACI: "",
            elevation: "",
            position: {
              type: "Point",
              coordinates: [41.940823995744914, -7.4398998463702713]
            }
          }
        });
  }

  handleInputChange = event => {
    event.preventDefault();
    if (event.target.name === "x") {
      this.setState({
        aerodrome: {
          ...this.state.aerodrome,
          position: {
            ...this.state.aerodrome.position,
            coordinates: [
              event.target.value,
              this.state.aerodrome.position.coordinates[1]
            ]
          }
        }
      });
    } else if (event.target.name === "y") {
      this.setState({
        aerodrome: {
          ...this.state.aerodrome,
          position: {
            ...this.state.aerodrome.position,
            coordinates: [
              this.state.aerodrome.position.coordinates[0],
              event.target.value
            ]
          }
        }
      });
    } else {
      this.setState({
        aerodrome: {
          ...this.state.aerodrome,
          [event.target.name]: event.target.value
        }
      });
    }
  };

  handleClick(e) {
    let x = e.latlng.lat;
    let y = e.latlng.lng;
    let newPos = [x, y];
    this.setState(prevState => ({
      aerodrome: {
        ...this.state.aerodrome,
        position: {
          ...this.state.aerodrome.position,
          coordinates: newPos
        }
      }
    }));
  }

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
        notify.show("Cannot modify aerodrome.", "error", 3000);
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
    const initialPosition = this.state.aerodrome.position.coordinates;
    return (
      <div className="container">
        <h2 className="tittle">
          Edit aerodrome
          <Button variant="back" onClick={this.goBack}>
            Back
          </Button>
        </h2>
        <hr />
        <Form onSubmit={this.handleSubmitEdit}>
          {/* Primera columna (Name, City, Country) */}
          <Row>
            <Col>
              <Form.Group className="m-3" as={Row} controlId="formGridName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  required
                  maxLength="36"
                  type="text"
                  defaultValue={aerodrome.name}
                  name="name"
                  onChange={this.handleInputChange}
                />
              </Form.Group>
              <Form.Group className="m-3" as={Row} controlId="formGridCountry">
                <Form.Label>Country</Form.Label>
                <Form.Control
                  required
                  type="text"
                  defaultValue={aerodrome.country}
                  name="country"
                  onChange={this.handleInputChange}
                />
              </Form.Group>
              <Form.Group className="m-3" as={Row} controlId="formGridCity">
                <Form.Label>City</Form.Label>
                <Form.Control
                  required
                  type="text"
                  defaultValue={aerodrome.city}
                  name="city"
                  onChange={this.handleInputChange}
                />
              </Form.Group>
            </Col>
            {/* Segunda columna (MAPA) */}
            <Col>
              <Map
                onclick={this.handleClick}
                center={initialPosition}
                zoom={this.state.zoom}
                className="map_aerod"
              >
                <TileLayer
                  attribution=' Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://maps.heigit.org/openmapsurfer/tiles/roads/webmercator/{z}/{x}/{y}.png"
                />
                <Marker position={initialPosition}></Marker>
              </Map>
            </Col>
          </Row>
          {/* Fila de abajo (IATA, OACI, Elevación, Coordenadas(X, Y)) */}
          <Row>
            <Form.Group className="m-3" as={Col} controlId="formGridIATA">
              <Form.Label>IATA</Form.Label>
              <Form.Control
                type="text"
                defaultValue={aerodrome.codIATA}
                name="codIATA"
                onChange={this.handleInputChange}
              />
            </Form.Group>
            <Form.Group className="m-3" as={Col} controlId="formGridOACI">
              <Form.Label>OACI</Form.Label>
              <Form.Control
                type="text"
                defaultValue={aerodrome.codOACI}
                name="codOACI"
                onChange={this.handleInputChange}
              />
            </Form.Group>
            <Form.Group className="m-3" as={Col} controlId="formGridElevation">
              <Form.Label>Elevation (ft)</Form.Label>
              <Form.Control
                type="number"
                defaultValue={aerodrome.elevation}
                name="elevation"
                onChange={this.handleInputChange}
              />
            </Form.Group>
            <Form.Group className="m-3" as={Col} controlId="formGridX">
              <Form.Label>Latitude:</Form.Label>
              <Form.Control
                required
                type="number"
                placeholder="Latitude"
                value={this.state.aerodrome.position.coordinates[0]}
                name="x"
                onChange={this.handleInputChange}
              />
            </Form.Group>

            <Form.Group className="m-3" as={Col} controlId="formGridY">
              <Form.Label>Longitude:</Form.Label>
              <Form.Control
                required
                type="number"
                placeholder="Longitude"
                value={this.state.aerodrome.position.coordinates[1]}
                name="y"
                onChange={this.handleInputChange}
              />
            </Form.Group>
          </Row>
          <Button className="btn m-3" variant="new" type="submit">
            Save
          </Button>
        </Form>
      </div>
    );
  }

  renderNew() {
    const initialPosition = this.state.aerodrome.position.coordinates;
    return (
      <div className="container">
        <h2 className="tittle">
          Create new aerodrome
          <Button variant="back" onClick={this.goBack}>
            Back
          </Button>
        </h2>
        <hr />
        <Form onSubmit={this.handleSubmitNew}>
          {/* Primera columna (Name, City, Country) */}
          <Row>
            <Col>
              <Form.Group className="m-3" as={Row} controlId="formGridName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  maxLength="36"
                  placeholder="Name"
                  name="name"
                  onChange={this.handleInputChange}
                />
              </Form.Group>
              <Form.Group className="m-3" as={Row} controlId="formGridCountry">
                <Form.Label>Country</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Country"
                  name="country"
                  onChange={this.handleInputChange}
                />
              </Form.Group>
              <Form.Group className="m-3" as={Row} controlId="formGridCity">
                <Form.Label>City</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="City"
                  name="city"
                  onChange={this.handleInputChange}
                />
              </Form.Group>
            </Col>
            {/* Segunda columna (MAPA) */}
            <Col>
              <Map
                center={initialPosition}
                zoom={this.state.zoom}
                onClick={this.handleClick}
              >
                <TileLayer
                  attribution=' Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://maps.heigit.org/openmapsurfer/tiles/roads/webmercator/{z}/{x}/{y}.png"
                />
                <Marker position={initialPosition}></Marker>
              </Map>
            </Col>
          </Row>
          {/* Fila de abajo (IATA, OACI, Elevación, Coordenadas(X, Y)) */}
          <Row>
            <Form.Group className="m-3" as={Col} controlId="formGridIATA">
              <Form.Label>IATA</Form.Label>
              <Form.Control
                type="text"
                placeholder="IATA code"
                name="codIATA"
                onChange={this.handleInputChange}
              />
            </Form.Group>
            <Form.Group className="m-3" as={Col} controlId="formGridOACI">
              <Form.Label>OACI</Form.Label>
              <Form.Control
                type="text"
                placeholder="OACI code"
                name="codOACI"
                onChange={this.handleInputChange}
              />
            </Form.Group>
            <Form.Group className="m-3" as={Col} controlId="formGridElevation">
              <Form.Label>Elevation (ft)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Elevation"
                name="elevation"
                onChange={this.handleInputChange}
              />
            </Form.Group>
            <Form.Group className="m-3" as={Col} controlId="formGridX">
              <Form.Label>Latitude:</Form.Label>
              <Form.Control
                required
                type="number"
                value={this.state.aerodrome.position.coordinates[0]}
                placeholder="Latitude"
                name="x"
                onChange={this.handleInputChange}
              />
            </Form.Group>

            <Form.Group className="m-3" as={Col} controlId="formGridY">
              <Form.Label>Longitude:</Form.Label>
              <Form.Control
                required
                type="number"
                value={this.state.aerodrome.position.coordinates[1]}
                placeholder="Longitude"
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
    return aerodrome ? this.renderEdit(aerodrome) : this.renderNew();
  }
}

export default connect(withRouter)(AerodromeForm);
