import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";
import { Button } from "react-bootstrap";
import "./FlightDetail.css";
import MapFlight from "../MapFlight";
import { Link } from "react-router-dom";
import { HTTP } from "../../../common/http-common";
import { connect } from "react-redux";
import { notify } from "react-notify-toast";
import Loader from "react-loader-spinner";

class FlightDetail extends Component {
  constructor(props) {
    super(props);
    this.state = { flight: undefined };

    this.goBack = this.goBack.bind(this);
  }

  goBack() {
    this.props.history.goBack();
  }

  componentDidMount() {
    HTTP.get(`users/${this.props.login}`)
      .then(res => {
        const routes = res.data.createdRoutes;
        this.setState({ routes });
      })
      .catch(function(error) {
        notify.show("Error loading pilot routes", "error");
      });

    HTTP.get(`flights/details/${this.props.match.params.id}`)
      .then(res => {
        const flight = res.data;
        this.setState({ flight });
      })
      .catch(function(error) {
        notify.show("Error loading pilot routes", "error");
      });
  }

  drawFlight() {
    const flight = this.state.flight;
    let toAer = flight.takeoffAerodrome;
    let ldAer = flight.landingAerodrome;
    let polyline = [toAer.position.coordinates, ldAer.position.coordinates];
    let bounds;

    if (!flight.route) {
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
            polyline={polyline}
          ></MapFlight>
        );
      }
    } else {
      bounds = this.getBounds(flight);

      return (
        <MapFlight
          bounds={bounds}
          zoom={10}
          marker1={flight.route.path.coordinates[0]}
          polyline={flight.route.path.coordinates}
        ></MapFlight>
      );
    }
  }

  getBounds(flight) {
    if (flight.route) {
      let f1 = flight.route.path.coordinates;
      let f2 = flight.route.path.coordinates;

      return [f1, f2];
    } else {
      let f1 = flight.takeoffAerodrome.position.coordinates;
      let f2 = flight.landingAerodrome.position.coordinates;

      return [
        [f1[0], f1[1]],
        [f2[0], f2[1]]
      ];
    }
  }

  isMyRoute(routeCheck) {
    let routes = this.state.routes;
    let isThere;

    routes.map(
      route => (route.id = routeCheck.id ? (isThere = true) : (isThere = false))
    );

    return isThere;
  }

  getRoute(flight) {
    //CUANDO EXISTAN RUTAS, COMPROBAR SI TIENE
    if (!flight.route) {
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
    } else {
      if (flight.route.isPublic || this.isMyRoute(flight.route)) {
        return (
          <div>
            <Row>
              <h6 className="detailTitle">ROUTE</h6>
              <hr></hr>
            </Row>
            <Row>
              <h5>
                <Link
                  className="routeLink"
                  to={"/routes/detail/" + flight.route.id}
                >
                  {flight.route.name}
                </Link>
              </h5>
            </Row>
          </div>
        );
      } else
        return (
          <div>
            <Row>
              <h6 className="detailTitle">ROUTE</h6>
              <hr></hr>
            </Row>
            <Row>
              <h5>{flight.route.name}</h5>
            </Row>
          </div>
        );
    }
  }

  renderDetail(flight) {
    return (
      <div className="container">
        <h3 className="tittle">
          <b>{flight.departureDate}</b> Flight from{" "}
          <b>{flight.takeoffAerodrome.city}</b> to{" "}
          <b>{flight.landingAerodrome.city}</b>
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
    if (this.state.flight && this.state.routes) {
      const flight = this.state.flight;
      return this.renderDetail(flight);
    } else
      return (
        <div className="loader">
          <Loader
            as="span"
            type="Plane"
            color="#6b6630"
            height={20}
            width={20}
          />
        </div>
      );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    login: state.auth.login
  };
}

export default connect(mapStateToProps)(FlightDetail);
