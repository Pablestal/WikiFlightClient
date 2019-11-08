import React, { Component } from "react";

import { Form, Row, Col, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { HTTP } from "../../../common/http-common";
import { withRouter } from "react-router-dom";
import { notify } from "react-notify-toast";
import SunIcon from "../../../icons/Sun";
import MoonIcon from "../../../icons/Moon";

import "./FlightNew.css";

class FlightEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flight: {
        aircraft: {
          manufacturer: "",
          model: ""
        },
        seTime: "00:00:00",
        meTime: "00:00:00",
        mpTime: "00:00:00",
        nightTime: "00:00:00",
        ifrTime: "00:00:00",
        picTime: "00:00:00",
        dualTime: "00:00:00",
        coopilotTime: "00:00:00",
        instructorTime: "00:00:00"
      }
    };
    this.goBack = this.goBack.bind(this);
  }

  goBack() {
    this.props.history.goBack();
  }

  componentDidMount() {
    this.getPilot();
    this.setState({
      flight: {
        aircraft: {
          manufacturer: "",
          model: ""
        }
      }
    });
  }

  getPilot = async () => {
    let res = await HTTP.get(`users/${this.props.login}`);

    let pilot = res.data;

    this.setState({
      flight: {
        ...this.state.flight,
        picUser: pilot
      }
    });
  };

  handleSubmitNew = event => {
    event.preventDefault();
    const flight = this.state.flight;
    if (!flight.departureTime) flight.departureTime = "00:00";
    if (!flight.arrivalTime) flight.arrivalTime = "00:00";
    if (!flight.seTime) flight.seTime = "00:00";
    if (!flight.meTime) flight.meTime = "00:00";
    if (!flight.mpTime) flight.mpTime = "00:00";
    if (!flight.nightTime) flight.nightTime = "00:00";
    if (!flight.ifrTime) flight.ifrTime = "00:00";
    if (!flight.picTime) flight.picTime = "00:00";
    if (!flight.coopilotTime) flight.coopilotTime = "00:00";
    if (!flight.dualTime) flight.dualTime = "00:00";
    if (!flight.instructorTime) flight.instructorTime = "00:00";

    const {
      history: { push }
    } = this.props;
    HTTP.post(`/flights`, flight)
      .then(function(response) {
        notify.show("Successfully created", "success", 3000);
        push("/myLogbook");
      })
      .catch(function(error) {
        notify.show("Error creating flight.", "error", 3000);
      });
  };

  handleInputObjChange = event => {
    event.preventDefault();
    let ename = event.target.name;
    let evalue = event.target.value;

    if (ename === "manufacturer") {
      this.setState({
        flight: {
          ...this.state.flight,
          aircraft: {
            ...this.state.flight.aircraft,
            manufacturer: evalue,
            model: null
          }
        }
      });
    } else if (ename === "model") {
      this.setState({
        flight: {
          ...this.state.flight,
          aircraft: {
            ...this.state.flight.aircraft,
            model: evalue
          }
        }
      });
    }
  };

  handleInputChange = event => {
    event.preventDefault();

    this.setState({
      flight: {
        ...this.state.flight,
        [event.target.name]: event.target.value
      }
    });
  };

  filterManufacturers() {
    const unique = (value, index, self) => {
      return self.indexOf(value) === index;
    };

    const manufacturers = [];

    this.props.aircrafts.forEach(function(aircraft) {
      manufacturers.push(aircraft.manufacturer);
    });

    const filteredManufacturers = manufacturers.filter(unique);
    return filteredManufacturers;
  }

  getModels(manufacturer) {
    const models = [];

    this.props.aircrafts.forEach(function(aircraft) {
      if (aircraft.manufacturer === manufacturer) models.push(aircraft.model);
    });

    return models;
  }

  getTakeoffAerodrome = async event => {
    event.preventDefault();
    let res = await HTTP.get(`aerodromes/${event.target.value}`);
    let toAer = res.data;
    this.setState({
      flight: { ...this.state.flight, takeoffAerodrome: toAer }
    });
  };

  getLandingAerodrome = async event => {
    event.preventDefault();
    let res = await HTTP.get(`aerodromes/${event.target.value}`);
    let toAer = res.data;
    this.setState({
      flight: { ...this.state.flight, landingAerodrome: toAer }
    });
  };

  getAircraft = async event => {
    event.preventDefault();
    let res = await HTTP.get(`aircrafts/${event.target.value}`);
    let airc = res.data;
    this.setState({
      flight: { ...this.state.flight, aircraft: airc }
    });
  };

  renderNew() {
    const manufacturers = this.filterManufacturers();
    let models;
    let defTime = "00:00";
    let defNum = 0;

    this.state.flight.aircraft.manufacturer
      ? (models = this.getModels(this.state.flight.aircraft.manufacturer))
      : (models = []);

    return (
      <div className="container">
        <h2 className="tittle">
          Create new logbook entry
          <Button variant="back" onClick={this.goBack}>
            Back
          </Button>
        </h2>
        <hr />
        <Form onSubmit={this.handleSubmitNew}>
          {/* Fila 1 / 2 Departure(Col1: Airport1, Airport2) Arrival(Col2: Date1, Time1, Date2, Time2) */}
          <h4 className="formTittle">Departure and Arrival Info</h4>
          <h6>* Both times must be in the same time zone.</h6>

          <Row>
            <Form.Group md="5" as={Col} controlId="formGridDepAirport">
              <Form.Label>Departure airport</Form.Label>
              <Form.Control
                required
                defaultValue={1}
                as="select"
                name="takeoffAerodrome"
                onChange={this.getTakeoffAerodrome}
              >
                <option value={1} default disabled>
                  Select an airport...
                </option>
                {this.props.aerodromes.map(function(aerodrome, index) {
                  return <option key={index}>{aerodrome.name}</option>;
                }, this)}
              </Form.Control>
            </Form.Group>

            <Form.Group md="3" as={Col} controlId="formGridDepDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                required
                placeholder="Date"
                type="Date"
                name="departureDate"
                onChange={this.handleInputChange}
              />
            </Form.Group>
            <Form.Group md="2" as={Col} controlId="formGridDepTime">
              <Form.Label>Time</Form.Label>
              <Form.Control
                required
                defaultValue={defTime}
                type="time"
                name="departureTime"
                onChange={this.handleInputChange}
              />
            </Form.Group>
          </Row>
          <Row>
            <Form.Group md="5" as={Col} controlId="formGridArrAirport">
              <Form.Label>Arrival airport</Form.Label>
              <Form.Control
                required
                as="select"
                defaultValue={1}
                name="landingAerodrome"
                onChange={this.getLandingAerodrome}
              >
                <option value={1} default disabled>
                  Select an airport...
                </option>
                {this.props.aerodromes.map(function(aerodrome, index) {
                  return <option key={index}>{aerodrome.name}</option>;
                }, this)}
              </Form.Control>
            </Form.Group>
            <Form.Group md="3" as={Col} controlId="formGridArrDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                required
                type="Date"
                placeholder="Date"
                name="arrivalDate"
                onChange={this.handleInputChange}
              />
            </Form.Group>
            <Form.Group md="2" as={Col} controlId="formGridArrTime">
              <Form.Label>Time</Form.Label>
              <Form.Control
                required
                type="time"
                defaultValue={defTime}
                name="arrivalTime"
                onChange={this.handleInputChange}
              />
            </Form.Group>
          </Row>

          {/* Fila 3 TotalTakeoffs(Col1: Day, Night) TotalLandings(Col2: Day, Night) */}

          <Row>
            <Col xs={2} className="toCol">
              <h4 className="formTittle">Total takeoffs</h4>

              <Row>
                <Form.Group as={Col} controlId="formGridTakeoffsDay">
                  <Form.Label>
                    <SunIcon width="25px" height="25px" />
                  </Form.Label>
                  <Form.Control
                    required
                    type="number"
                    defaultValue={defNum}
                    name="takeoffsDay"
                    onChange={this.handleInputChange}
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridTakeoffsNight">
                  <Form.Label>
                    <MoonIcon width="25px" height="25px" />
                  </Form.Label>
                  <Form.Control
                    required
                    type="number"
                    defaultValue={defNum}
                    name="takeoffsNight"
                    onChange={this.handleInputChange}
                  />
                </Form.Group>
              </Row>
            </Col>
            <Col xs={2}>
              <h4 className="formTittle">Total landings</h4>

              <Row>
                <Form.Group as={Col} controlId="formGridLandingsDay">
                  <Form.Label>
                    <SunIcon width="25px" height="25px" />
                  </Form.Label>
                  <Form.Control
                    required
                    type="number"
                    defaultValue={defNum}
                    name="landingsDay"
                    onChange={this.handleInputChange}
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="formGridLandingsNight">
                  <Form.Label>
                    <MoonIcon width="25px" height="25px" />
                  </Form.Label>
                  <Form.Control
                    required
                    type="number"
                    defaultValue={defNum}
                    name="landingsNight"
                    onChange={this.handleInputChange}
                  />
                </Form.Group>
              </Row>
            </Col>
          </Row>

          {/* Fila 4 Single/Multi pilot times SE, ME, MPT */}
          {/* Fila 5 Operational condition time Night, IFR */}
          <Row>
            <Col>
              <h4 className="formTittle">Single and Multi pilot times</h4>
              <Row>
                <Form.Group md="3" as={Col} controlId="formGridSeTime">
                  <Form.Label>Single Engine</Form.Label>
                  <Form.Control
                    required
                    type="time"
                    defaultValue={defTime}
                    name="seTime"
                    onChange={this.handleInputChange}
                  />
                </Form.Group>

                <Form.Group md="3" as={Col} controlId="formGridMeTime">
                  <Form.Label>Multi Engine</Form.Label>
                  <Form.Control
                    required
                    type="time"
                    defaultValue={defTime}
                    name="meTime"
                    onChange={this.handleInputChange}
                  />
                </Form.Group>

                <Form.Group md="3" as={Col} controlId="formGridMpTime">
                  <Form.Label>Multi Pilot</Form.Label>
                  <Form.Control
                    required
                    type="time"
                    defaultValue={defTime}
                    name="mpTime"
                    onChange={this.handleInputChange}
                  />
                </Form.Group>
              </Row>
            </Col>
            <Col>
              <h4 className="formTittle">Operational condition time</h4>
              <Row>
                <Form.Group md="3" as={Col} controlId="formGridNightTime">
                  <Form.Label>Night</Form.Label>
                  <Form.Control
                    required
                    type="time"
                    defaultValue={defTime}
                    name="nightTime"
                    onChange={this.handleInputChange}
                  />
                </Form.Group>

                <Form.Group md="3" as={Col} controlId="formGridIfrTime">
                  <Form.Label>IFR</Form.Label>
                  <Form.Control
                    required
                    type="time"
                    defaultValue={defTime}
                    name="ifrTime"
                    onChange={this.handleInputChange}
                  />
                </Form.Group>
              </Row>
            </Col>
          </Row>

          {/* Fila 6 Pilot function time PIC, Coop, Dual, Instr */}
          <h4 className="formTittle">Pilot function times</h4>

          <Row>
            <Col xs={9}>
              <Row>
                <Form.Group md="2" as={Col} controlId="formGridpicTime">
                  <Form.Label>PIC</Form.Label>
                  <Form.Control
                    required
                    type="time"
                    defaultValue={defTime}
                    name="picTime"
                    onChange={this.handleInputChange}
                  />
                </Form.Group>

                <Form.Group md="2" as={Col} controlId="formGridCoopTime">
                  <Form.Label>Coopilot</Form.Label>
                  <Form.Control
                    required
                    type="time"
                    defaultValue={defTime}
                    name="coopilotTime"
                    onChange={this.handleInputChange}
                  />
                </Form.Group>

                <Form.Group md="2" as={Col} controlId="formGridDualTime">
                  <Form.Label>Dual</Form.Label>
                  <Form.Control
                    required
                    type="time"
                    defaultValue={defTime}
                    name="dualTime"
                    onChange={this.handleInputChange}
                  />
                </Form.Group>

                <Form.Group md="2" as={Col} controlId="formGridInstrTime">
                  <Form.Label>Instructor</Form.Label>
                  <Form.Control
                    required
                    type="time"
                    defaultValue={defTime}
                    name="instructorTime"
                    onChange={this.handleInputChange}
                  />
                </Form.Group>
              </Row>
            </Col>
          </Row>

          {/* Fila 7: Aircraft, AircReg  */}
          <h4 className="formTittle">Aircraft info</h4>

          <Row>
            <Form.Group as={Col} controlId="formGridAircraft">
              <Form.Label>Manufacturer</Form.Label>
              <Form.Control
                required
                defaultValue={1}
                as="select"
                name="manufacturer"
                onChange={this.handleInputObjChange}
              >
                <option value={1} default disabled>
                  Choose one...
                </option>
                {manufacturers.map(function(manufacturer, index) {
                  return <option key={index}>{manufacturer}</option>;
                }, this)}
              </Form.Control>
            </Form.Group>

            <Form.Group as={Col} controlId="formGridAircraft">
              <Form.Label>Model</Form.Label>
              <Form.Control
                required
                defaultValue={1}
                as="select"
                name="model"
                onChange={this.getAircraft}
              >
                <option value={1} default disabled>
                  Choose one...
                </option>
                {models.map(function(model, index) {
                  return <option key={index}>{model}</option>;
                }, this)}
              </Form.Control>
            </Form.Group>

            <Form.Group as={Col} controlId="formGridAircraftReg">
              <Form.Label>Registration</Form.Label>
              <Form.Control
                placeholder="Aircraft Reg."
                type="text"
                name="aircraftReg"
                onChange={this.handleInputChange}
              />
            </Form.Group>
          </Row>

          {/* Fila 8: Observations*/}
          <h4 className="formTittle">Observations</h4>
          <Row>
            <Form.Group as={Col} controlId="formGridAircraftReg">
              <Form.Control
                placeholder="Observations..."
                as="textarea"
                name="observations"
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

  render() {
    return this.renderNew();
  }
}

function mapStateToProps(state) {
  return {
    aircrafts: state.airc.aircrafts,
    aerodromes: state.aerod.aerodromes,
    login: state.auth.login
  };
}

export default connect(
  mapStateToProps,
  withRouter
)(FlightEdit);
