import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";
import { Button } from "react-bootstrap";
import "./FlightDetail.css";
import MapFlight from "../MapFlight";

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

    if (toAer.name === ldAer.name) {
      return (
        <MapFlight
          initialPosition={flight.takeoffAerodrome.position.coordinates}
          zoom={10}
        ></MapFlight>
      );
    } else {
      bounds = this.getBounds(flight);

      return (
        <MapFlight
          bounds={bounds}
          zoom={10}
          marker1={toAer.position.coordinates}
          marker2={ldAer.position.coordinates}
          polyline={polyline}
        ></MapFlight>
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
          <Col xs={2} className="tolnCol">
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
                Night: <b>{flight.nightTime}</b>&nbsp;&nbsp;&nbsp;&nbsp;
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
                PIC: <b>{flight.picTime}</b>&nbsp;&nbsp;&nbsp;&nbsp;
              </h5>
              <h5>
                Coopilot: <b>{flight.coopilotTime}</b>&nbsp;&nbsp;&nbsp;
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
