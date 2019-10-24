import React, { Component } from "react";

import { Form, Row, Col, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { HTTP } from "../../../common/http-common";
import { withRouter } from "react-router-dom";
import { notify } from "react-notify-toast";
import SunIcon from "../../../icons/Sun";
import MoonIcon from "../../../icons/Moon";

class FlightEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flight: {}
    };
    this.goBack = this.goBack.bind(this);
    this.handleSubmitEdit = this.handleSubmitEdit.bind(this);
  }

  goBack() {
    this.props.history.goBack();
  }

  componentDidMount() {
    const flight = this.props.location.state.selected;
    flight
      ? this.setState({ flight: flight })
      : this.setState({
          flight: ""
        });
  }

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
    // let totaltime;
    // if (
    //   event.target.name === "departureTime" ||
    //   event.target.name === "arrivalTime"
    // ) {
    //   this.setState({
    //     flight: {
    //       ...this.state.flight,
    //       [event.target.name]: event.target.value
    //     }
    //   });
    //   totaltime = Math.abs(
    //     this.state.flight.arrivalTime - this.state.flight.departureTime
    //   );
    //   console.log(totaltime);
    //   this.setState({
    //     flight: {
    //       ...this.state.flight,
    //       totalTime: totaltime
    //     }
    //   });
    // } else {
    this.setState({
      flight: {
        ...this.state.flight,
        [event.target.name]: event.target.value
      }
    });
    // }
  };

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

  handleSubmitEdit = event => {
    event.preventDefault();

    if (this.state.flight.aircraft.model !== null) {
      const flight = this.state.flight;
      const {
        history: { push }
      } = this.props;
      HTTP.put(`flights/${flight.id}`, flight)
        .then(function(response) {
          notify.show("Successfully modified", "success", 3000);
          push("/myLogbook");
        })
        .catch(function(error) {
          notify.show("Cannot modify flight.", "error", 3000);
        });
    } else notify.show("Please select an aircraft model.", "error", 3000);
  };

  //   handleSubmitNew = event => {
  //     event.preventDefault();
  //     const aerodrome = this.state.aerodrome;
  //     const {
  //       history: { push }
  //     } = this.props;
  //     HTTP.post(`/aerodromes`, aerodrome)
  //       .then(function(response) {
  //         notify.show("Successfully modified", "success", 3000);
  //         push("/aerodromes");
  //       })
  //       .catch(function(error) {
  //         notify.show("This aerodrome already exists.", "error", 3000);
  //       });
  //   };

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

  renderEdit(flight) {
    const manufacturers = this.filterManufacturers();
    let models;

    this.state.flight.aircraft
      ? (models = this.getModels(this.state.flight.aircraft.manufacturer))
      : (models = this.getModels(flight.aircraft.manufacturer));

    console.log(this.state.flight);
    return (
      <div className="container">
        <h2 className="tittle">
          Edit logbook entry
          <Button variant="back" onClick={this.goBack}>
            Back
          </Button>
        </h2>
        <hr />
        <Form onSubmit={this.handleSubmitEdit}>
          {/* Fila 1 / 2 Departure(Col1: Airport1, Airport2) Arrival(Col2: Date1, Time1, Date2, Time2) */}
          <h4 className="formTittle">Departure and Arrival Info</h4>

          <Row>
            <Form.Group className="m-3" as={Col} controlId="formGridDepAirport">
              <Form.Label>Departure airport</Form.Label>
              <Form.Control
                required
                as="select"
                defaultValue={flight.takeoffAerodrome.name}
                name="takeoffAerodrome"
                onChange={this.getTakeoffAerodrome}
              >
                {this.props.aerodromes.map(function(aerodrome, index) {
                  return <option key={index}>{aerodrome.name}</option>;
                }, this)}
              </Form.Control>
            </Form.Group>

            <Form.Group className="m-3" as={Col} controlId="formGridDepDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                required
                defaultValue={flight.departureDate}
                type="Date"
                name="departureDate"
                onChange={this.handleInputChange}
              />
            </Form.Group>
            <Form.Group className="m-3" as={Col} controlId="formGridDepTime">
              <Form.Label>Time</Form.Label>
              <Form.Control
                required
                defaultValue={flight.departureTime}
                type="time"
                name="departureTime"
                onChange={this.handleInputChange}
              />
            </Form.Group>
          </Row>
          <Row>
            <Form.Group className="m-3" as={Col} controlId="formGridArrAirport">
              <Form.Label>Arrival airport</Form.Label>
              <Form.Control
                required
                as="select"
                defaultValue={flight.landingAerodrome.name}
                name="landingAerodrome"
                onChange={this.getLandingAerodrome}
              >
                {this.props.aerodromes.map(function(aerodrome, index) {
                  return <option key={index}>{aerodrome.name}</option>;
                }, this)}
              </Form.Control>
            </Form.Group>
            <Form.Group className="m-3" as={Col} controlId="formGridArrDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                required
                type="Date"
                defaultValue={flight.arrivalDate}
                name="arrivalDate"
                onChange={this.handleInputChange}
              />
            </Form.Group>
            <Form.Group className="m-3" as={Col} controlId="formGridArrTime">
              <Form.Label>Time</Form.Label>
              <Form.Control
                required
                type="time"
                defaultValue={flight.arrivalTime}
                name="arrivalTime"
                onChange={this.handleInputChange}
              />
            </Form.Group>
          </Row>

          {/* Fila 3 TotalTakeoffs(Col1: Day, Night) TotalLandings(Col2: Day, Night) */}

          <Row>
            <Col>
              <h4 className="formTittle">Total takeoffs</h4>
            </Col>
            <Col>
              <h4 className="formTittle">Total landings</h4>
            </Col>
          </Row>
          <Row>
            <Form.Group
              className="m-3"
              as={Col}
              controlId="formGridTakeoffsDay"
            >
              <Form.Label>
                <SunIcon width="25px" height="25px" />
              </Form.Label>
              <Form.Control
                required
                type="number"
                defaultValue={flight.takeoffsDay}
                name="takeoffsDay"
                onChange={this.handleInputChange}
              />
            </Form.Group>

            <Form.Group
              className="m-3"
              as={Col}
              controlId="formGridTakeoffsNight"
            >
              <Form.Label>
                <MoonIcon width="25px" height="25px" />
              </Form.Label>
              <Form.Control
                required
                type="number"
                defaultValue={flight.takeoffsNight}
                name="takeoffsNight"
                onChange={this.handleInputChange}
              />
            </Form.Group>

            <Form.Group
              className="m-3"
              as={Col}
              controlId="formGridLandingsDay"
            >
              <Form.Label>
                <SunIcon width="25px" height="25px" />
              </Form.Label>
              <Form.Control
                required
                type="number"
                defaultValue={flight.landingsDay}
                name="landingsDay"
                onChange={this.handleInputChange}
              />
            </Form.Group>
            <Form.Group
              className="m-3"
              as={Col}
              controlId="formGridLandingsNight"
            >
              <Form.Label>
                <MoonIcon width="25px" height="25px" />
              </Form.Label>
              <Form.Control
                required
                type="number"
                defaultValue={flight.landingsNight}
                name="landingsNight"
                onChange={this.handleInputChange}
              />
            </Form.Group>
          </Row>

          {/* Fila 4 Single/Multi pilot times SE, ME, MPT */}
          <h4 className="formTittle">Single and Multi pilot times</h4>
          <Row>
            <Form.Group className="m-3" as={Col} controlId="formGridSeTime">
              <Form.Label>Single Engine</Form.Label>
              <Form.Control
                required
                type="time"
                defaultValue={flight.seTime}
                name="seTime"
                onChange={this.handleInputChange}
              />
            </Form.Group>

            <Form.Group className="m-3" as={Col} controlId="formGridMeTime">
              <Form.Label>Multi Engine</Form.Label>
              <Form.Control
                required
                type="time"
                defaultValue={flight.meTime}
                name="meTime"
                onChange={this.handleInputChange}
              />
            </Form.Group>

            <Form.Group className="m-3" as={Col} controlId="formGridMpTime">
              <Form.Label>Multi Pilot</Form.Label>
              <Form.Control
                required
                type="time"
                defaultValue={flight.mpTime}
                name="mpTime"
                onChange={this.handleInputChange}
              />
            </Form.Group>
          </Row>

          {/* Fila 5 Operational condition time Night, IFR */}
          <h4 className="formTittle">Operational condition time</h4>

          <Row>
            <Form.Group className="m-3" as={Col} controlId="formGridNightTime">
              <Form.Label>Night</Form.Label>
              <Form.Control
                required
                type="time"
                defaultValue={flight.nightTime}
                name="nightTime"
                onChange={this.handleInputChange}
              />
            </Form.Group>

            <Form.Group className="m-3" as={Col} controlId="formGridIfrTime">
              <Form.Label>IFR</Form.Label>
              <Form.Control
                required
                type="time"
                defaultValue={flight.ifrTime}
                name="ifrTime"
                onChange={this.handleInputChange}
              />
            </Form.Group>
          </Row>

          {/* Fila 6 Pilot function time PIC, Coop, Dual, Instr */}
          <h4 className="formTittle">Pilot function times</h4>

          <Row>
            <Form.Group className="m-3" as={Col} controlId="formGridpicTime">
              <Form.Label>PIC</Form.Label>
              <Form.Control
                required
                type="time"
                defaultValue={flight.picTime}
                name="picTime"
                onChange={this.handleInputChange}
              />
            </Form.Group>

            <Form.Group className="m-3" as={Col} controlId="formGridCoopTime">
              <Form.Label>Coopilot</Form.Label>
              <Form.Control
                required
                type="time"
                defaultValue={flight.coopilotTime}
                name="coopilotTime"
                onChange={this.handleInputChange}
              />
            </Form.Group>

            <Form.Group className="m-3" as={Col} controlId="formGridDualTime">
              <Form.Label>Dual</Form.Label>
              <Form.Control
                required
                type="time"
                defaultValue={flight.dualTime}
                name="dualTime"
                onChange={this.handleInputChange}
              />
            </Form.Group>

            <Form.Group className="m-3" as={Col} controlId="formGridInstrTime">
              <Form.Label>Instructor</Form.Label>
              <Form.Control
                required
                type="time"
                defaultValue={flight.instructorTime}
                name="instructorTime"
                onChange={this.handleInputChange}
              />
            </Form.Group>
          </Row>
          {/* Fila 7: Aircraft, AircReg  */}
          <h4 className="formTittle">
            Edit aircraft (
            <b>
              {flight.aircraft.manufacturer} {flight.aircraft.model}
            </b>
            )
          </h4>

          <Row>
            <Form.Group className="m-3" as={Col} controlId="formGridAircraft">
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

            <Form.Group className="m-3" as={Col} controlId="formGridAircraft">
              <Form.Label>Model</Form.Label>
              <Form.Control
                required
                defaultValue={1}
                as="select"
                name="model"
                onChange={this.handleInputObjChange}
              >
                <option value={1} default disabled>
                  Choose one...
                </option>
                {models.map(function(model, index) {
                  return <option key={index}>{model}</option>;
                }, this)}
              </Form.Control>
            </Form.Group>

            <Form.Group
              className="m-3"
              as={Col}
              controlId="formGridAircraftReg"
            >
              <Form.Label>Registration</Form.Label>
              <Form.Control
                placeholder="Aircraft Reg."
                defaultValue={flight.aircraftReg}
                type="text"
                name="aircraftReg"
                onChange={this.handleInputChange}
              />
            </Form.Group>
          </Row>

          {/* Fila 8: Observations*/}
          <h4 className="formTittle">Observations</h4>
          <Row>
            <Form.Group
              className="m-3"
              as={Col}
              controlId="formGridAircraftReg"
            >
              <Form.Label>Observations</Form.Label>
              <Form.Control
                placeholder="Observations"
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
    const flight = this.props.location.state.selected;
    return flight ? this.renderEdit(flight) : this.renderNew();
  }
}

function mapStateToProps(state) {
  return {
    aircrafts: state.airc.aircrafts,
    aerodromes: state.aerod.aerodromes
  };
}

export default connect(
  mapStateToProps,
  withRouter
)(FlightEdit);
