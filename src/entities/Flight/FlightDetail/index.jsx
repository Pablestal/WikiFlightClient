import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { Map, TileLayer, Circle, Marker, Polyline } from "react-leaflet";
import "./FlightDetail.css";

class FlightDetail extends Component {
  constructor(props) {
    super(props);
    this.state = { flight: {} };

    this.goBack = this.goBack.bind(this);
  }

  goBack() {
    this.props.history.goBack();
  }

  drawPath() {
    const flight = this.props.location.state.selected;
    let toAer = flight.takeoffAerodrome;
    let ldAer = flight.landingAerodrome;
    let polyline = [toAer.position.coordinates, ldAer.position.coordinates];

    if (toAer.name === ldAer.name) {
      return (
        <div>
          <Marker position={toAer.position.coordinates}></Marker>
          <Circle
            center={flight.takeoffAerodrome.position.coordinates}
            color="#6b6630"
            radius={3000}
            dashArray="4"
          ></Circle>
        </div>
      );
    } else
      return (
        <div>
          <Marker position={toAer.position.coordinates}></Marker>
          <Marker position={ldAer.position.coordinates}></Marker>
          <Polyline
            positions={polyline}
            color="#6b6630"
            dashArray="4"
          ></Polyline>
        </div>
      );
  }

  renderDetail(flight) {
    return (
      <div className="container">
        <h2 className="tittle">
          <b>{flight.departureDate}</b> Flight from{" "}
          <b>
            {flight.takeoffAerodrome.name}({flight.takeoffAerodrome.codIATA})
          </b>{" "}
          to{" "}
          <b>
            {flight.landingAerodrome.name}({flight.landingAerodrome.codIATA})
          </b>
          <Button variant="back" onClick={this.goBack}>
            Back
          </Button>
        </h2>
        <hr />
        <Row>
          <Col className="detCol">
            <h3>
              <span className="detailTitle">From:&nbsp;&nbsp;</span>{" "}
              {flight.takeoffAerodrome.name}({flight.takeoffAerodrome.codIATA})
              <span className="detailTitle"> at </span>
              {flight.departureTime}
            </h3>

            <h3>
              <span className="detailTitle">To:&nbsp;&nbsp;</span>{" "}
              {flight.landingAerodrome.name}({flight.landingAerodrome.codIATA})
              <span className="detailTitle"> at </span>
              {flight.arrivalTime}
            </h3>

            <h3>
              <span className="detailTitle">Total time:&nbsp;&nbsp;</span>
              {flight.totalTime} minutes.
            </h3>
          </Col>
          <Col>
            <Map
              center={flight.takeoffAerodrome.position.coordinates}
              zoom={11}
              className="map_aerod"
            >
              <TileLayer
                attribution=' Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://maps.heigit.org/openmapsurfer/tiles/roads/webmercator/{z}/{x}/{y}.png"
              />
              {this.drawPath()}
            </Map>
          </Col>
        </Row>
      </div>
    );
  }

  render() {
    const flight = this.props.location.state.selected;
    return this.renderDetail(flight);
  }
}

export default FlightDetail;
