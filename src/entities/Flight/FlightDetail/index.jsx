import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { Map, TileLayer, Circle, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
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

  drawFlight() {
    const flight = this.props.location.state.selected;
    let toAer = flight.takeoffAerodrome;
    let ldAer = flight.landingAerodrome;
    let polyline = [toAer.position.coordinates, ldAer.position.coordinates];
    let bounds;

    const airportIcon = new L.Icon({
      iconUrl: require("../../../icons/airport.svg"),
      iconRetinaUrl: require("../../../icons/airport.svg"),
      iconAnchor: [23, 44],
      iconSize: [45, 45],
      shadowUrl: "../assets/marker-shadow.png",
      shadowSize: [68, 95],
      shadowAnchor: [20, 92]
    });

    if (toAer.name === ldAer.name) {
      return (
        <Map
          center={flight.takeoffAerodrome.position.coordinates}
          zoom={10}
          className="map_aerod"
        >
          <TileLayer
            attribution='Imagery from <a href="http://giscience.uni-hd.de/">University of Heidelberg</a> | Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://maps.heigit.org/openmapsurfer/tiles/roads/webmercator/{z}/{x}/{y}.png"
          />

          <Marker
            icon={airportIcon}
            position={toAer.position.coordinates}
          ></Marker>
          <Circle
            center={flight.takeoffAerodrome.position.coordinates}
            color="#a14655"
            radius={12000}
            dashArray="4"
          ></Circle>
        </Map>
      );
    } else {
      bounds = this.getBounds(flight);

      return (
        <Map
          center={flight.takeoffAerodrome.position.coordinates}
          zoom={11}
          className="map_aerod"
          bounds={bounds}
        >
          <TileLayer
            attribution='Imagery from <a href="http://giscience.uni-hd.de/">University of Heidelberg</a> | Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://maps.heigit.org/openmapsurfer/tiles/roads/webmercator/{z}/{x}/{y}.png"
          />

          <Marker
            icon={airportIcon}
            position={toAer.position.coordinates}
          ></Marker>
          <Marker
            icon={airportIcon}
            position={ldAer.position.coordinates}
          ></Marker>
          <Polyline
            positions={polyline}
            color="#a14655"
            dashArray="4"
          ></Polyline>
        </Map>
      );
    }
  }

  getRoute(flight) {
    //CUANDO EXISTAN RUTAS, COMPROBAR SI TIENE
    return (
      <div>
        <Row>
          <h6 className="detailTitle">ROUTE</h6>
          <hr></hr>
        </Row>
        <Row>
          <h5>This flight doesn't follow any public route.</h5>
        </Row>
      </div>
    );
  }

  getBounds(flight) {
    let f1 = flight.takeoffAerodrome.position.coordinates;
    let f2 = flight.landingAerodrome.position.coordinates;

    return [[f1[0], f1[1]], [f2[0], f2[1]]];
  }

  renderDetail(flight) {
    return (
      <div className="container">
        <h3 className="tittle">
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
        </h3>
        <hr />
        <Row>
          <Col>
            <Row>
              <h6 className="detailTitle">DEPARTURE</h6>
            </Row>

            <Row>
              <h5>
                <b>{flight.departureDate}</b> at <b>{flight.departureTime}</b>{" "}
                from&nbsp;
                <b>
                  {flight.takeoffAerodrome.name} (
                  {flight.takeoffAerodrome.codIATA})
                </b>
              </h5>
            </Row>
            <Row>
              <h6 className="detailTitle">ARRIVAL</h6>
            </Row>

            <Row>
              <h5>
                <b>{flight.arrivalDate}</b> at <b>{flight.arrivalTime}</b>{" "}
                at&nbsp;
                <b>
                  {flight.landingAerodrome.name} (
                  {flight.landingAerodrome.codIATA})
                </b>
              </h5>
            </Row>
            <Row>
              <h6 className="detailTitle">TOTAL TIME</h6>
            </Row>
            <Row>
              <h5>
                <b>{flight.totalTime} minutes.</b>
              </h5>
            </Row>
            <Row>
              <h6 className="detailTitle">AIRCRAFT</h6>
            </Row>
            <Row>
              <h5>
                <b>
                  {flight.aircraft.manufacturer} {flight.aircraft.model}
                </b>{" "}
                ({flight.aircraftReg})
              </h5>
            </Row>
            {this.getRoute(flight)}
          </Col>
          <Col>{this.drawFlight()}</Col>
        </Row>
        <hr></hr>
        <Row>
          <Col>
            <Row>
              <h6 className="detailTitle">TOTAL TAKEOFFS</h6>
            </Row>
            <Row>
              <h5>
                Day: <b>{flight.takeoffsDay}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b>{" "}
                Night: <b>{flight.takeoffsNight}</b>
              </h5>
            </Row>

            <Row>
              <h6 className="detailTitle">TOTAL LANDINGS</h6>
            </Row>
            <Row>
              <h5>
                Day: <b>{flight.landingsDay}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b>{" "}
                Night: <b>{flight.landingsNight}</b>
              </h5>
            </Row>
          </Col>
          <Col>
            <Row>
              <h6 className="detailTitle">SINGLE AND MULTI PILOT TIMES</h6>
            </Row>
            <Row>
              <h5>
                Single engine: <b>{flight.seTime}</b>
              </h5>
              <h5>
                Multi engine: <b>{flight.meTime}</b>
              </h5>
              <h5>
                Multi pilot: <b>{flight.mpTime}</b>
              </h5>
            </Row>
          </Col>
          <Col>
            <Row>
              <h6 className="detailTitle">OPERATIONAL CONDITIONS TIMES</h6>
            </Row>
            <Row>
              <h5 className="fixtime">
                Night: <b>{flight.nightTime}</b>
              </h5>
              <h5>
                IFR: <b>{flight.ifrTime}</b>
              </h5>
            </Row>
          </Col>
          <Col>
            <Row>
              <h6 className="detailTitle">PILOT FUNCTION TIMES</h6>
            </Row>
            <Row>
              <h5>
                PIC: <b>{flight.picTime}</b>
              </h5>
              <h5>
                Coopilot: <b>{flight.coopilotTime}</b>
              </h5>
              <h5>
                Dual: <b>{flight.dualTime}</b>
              </h5>
              <h5>
                Instructor: <b>{flight.instructorTime}</b>
              </h5>
            </Row>
          </Col>
        </Row>
        <Row>
          <h6 className="detailTitle">OBSERVATIONS</h6>
        </Row>
        <Row>
          <h5>
            <b>{flight.observations}</b>
          </h5>
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
