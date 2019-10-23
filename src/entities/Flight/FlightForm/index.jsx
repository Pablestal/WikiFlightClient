import React, { Component } from "react";

import { Form, Row, Col, Button } from "react-bootstrap";
import { connect } from "react-redux";
// import { HTTP } from "../../../common/http-common";
import { withRouter } from "react-router-dom";
// import { notify } from "react-notify-toast";
import SunIcon from "../../../icons/Sun";
import MoonIcon from "../../../icons/Moon";

class AerodromeForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flight: {
        //RELLENAR CAMPOS DE VUELO
      }
    };
    this.goBack = this.goBack.bind(this);
  }

  goBack() {
    this.props.history.goBack();
  }

  componentDidMount() {
    // const aerodrome = this.props.location.state.selected;
    // aerodrome
    //   ? this.setState({ aerodrome: aerodrome })
    //   : this.setState({
    //       aerodrome: {
    //         name: "",
    //         city: "",
    //         country: "",
    //         codIATA: "",
    //         codOACI: "",
    //         elevation: "",
    //         position: {
    //           type: "Point",
    //           coordinates: [41.940823995744914, -7.4398998463702713]
    //         }
    //       }
    //     });
  }

  //   handleInputChange = event => {
  //     event.preventDefault();
  //     if (event.target.name === "x") {
  //       this.setState({
  //         aerodrome: {
  //           ...this.state.aerodrome,
  //           position: {
  //             ...this.state.aerodrome.position,
  //             coordinates: [
  //               event.target.value,
  //               this.state.aerodrome.position.coordinates[1]
  //             ]
  //           }
  //         }
  //       });
  //     } else if (event.target.name === "y") {
  //       this.setState({
  //         aerodrome: {
  //           ...this.state.aerodrome,
  //           position: {
  //             ...this.state.aerodrome.position,
  //             coordinates: [
  //               this.state.aerodrome.position.coordinates[0],
  //               event.target.value
  //             ]
  //           }
  //         }
  //       });
  //     } else {
  //       this.setState({
  //         aerodrome: {
  //           ...this.state.aerodrome,
  //           [event.target.name]: event.target.value
  //         }
  //       });
  //     }
  //   };

  //   handleSubmitEdit = event => {
  //     event.preventDefault();
  //     const aerodrome = this.state.aerodrome;
  //     const {
  //       history: { push }
  //     } = this.props;
  //     HTTP.put(`aerodromes/${aerodrome.id}`, aerodrome)
  //       .then(function(response) {
  //         notify.show("Successfully modified", "success", 3000);
  //         push("/aerodromes");
  //       })
  //       .catch(function(error) {
  //         notify.show("Cannot modify aerodrome.", "error", 3000);
  //       });
  //   };

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

  renderEdit(flight) {
    return (
      <div className="container">
        <h2 className="tittle">
          Edit flight
          <Button variant="back" onClick={this.goBack}>
            Back
          </Button>
        </h2>
        <hr />
        <Form onSubmit={this.handleSubmitEdit}>
          {/* Fila 0: Aircraft, AircReg  */}
          <h4 className="tittle">Aircraft info</h4>

          <Row>
            <Form.Group className="m-3" as={Col} controlId="formGridAircraft">
              <Form.Label>Aircraft</Form.Label>
              <Form.Control
                required
                defaultValue={flight.aircraft}
                as="select"
                name="takeoffAerodrome"
                onChange={this.handleInputChange}
              >
                {this.props.aircrafts.map(function(aircraft, index) {
                  return (
                    <option key={index}>
                      {aircraft.manufacturer} {aircraft.model}
                    </option>
                  );
                }, this)}
              </Form.Control>
            </Form.Group>
            <Form.Group
              className="m-3"
              as={Col}
              controlId="formGridAircraftReg"
            >
              <Form.Label>Aircraft Reg.</Form.Label>
              <Form.Control
                required
                type="text"
                name="aircraftReg"
                onChange={this.handleInputChange}
              />
            </Form.Group>
          </Row>

          {/* Fila 1 / 2 Departure(Col1: Airport1, Airport2) Arrival(Col2: Date1, Time1, Date2, Time2) */}
          <h4 className="tittle">Departure and Arrival Info</h4>

          <Row>
            <Form.Group className="m-3" as={Col} controlId="formGridDepAirport">
              <Form.Label>Departure airport</Form.Label>
              <Form.Control
                required
                as="select"
                name="takeoffAerodrome"
                onChange={this.handleInputChange}
              >
                {this.props.aerodromes.map(function(aerodrome, index) {
                  return <option key={index}>{aerodrome.name}</option>;
                }, this)}
              </Form.Control>
            </Form.Group>

            <Form.Group className="m-3" as={Row} controlId="formGridDepDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                required
                type="Date"
                name="depDate"
                onChange={this.handleInputChange}
              />
            </Form.Group>
            <Form.Group className="m-3" as={Row} controlId="formGridDepTime">
              <Form.Label>Time</Form.Label>
              <Form.Control
                required
                type="time"
                name="depTime"
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
                name="landingAerodrome"
                onChange={this.handleInputChange}
              >
                {this.props.aerodromes.map(function(aerodrome, index) {
                  return <option key={index}>{aerodrome.name}</option>;
                }, this)}
              </Form.Control>
            </Form.Group>
            <Form.Group className="m-3" as={Row} controlId="formGridArrDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                required
                type="Date"
                name="arrDate"
                onChange={this.handleInputChange}
              />
            </Form.Group>
            <Form.Group className="m-3" as={Row} controlId="formGridArrTime">
              <Form.Label>Time</Form.Label>
              <Form.Control
                required
                type="time"
                name="arrTime"
                onChange={this.handleInputChange}
              />
            </Form.Group>
          </Row>

          {/* Fila 3 TotalTakeoffs(Col1: Day, Night) TotalLandings(Col2: Day, Night) */}

          <Row>
            <Col>
              <h4 className="tittle">Total takeoffs</h4>
            </Col>
            <Col>
              <h4 className="tittle">Total landings</h4>
            </Col>
          </Row>
          <Row>
            <Form.Group
              className="m-3"
              as={Row}
              controlId="formGridTakeoffsDay"
            >
              <Form.Label>
                <SunIcon width="25px" height="25px" />
              </Form.Label>
              <Form.Control
                required
                type="number"
                name="takeoffsDay"
                onChange={this.handleInputChange}
              />
            </Form.Group>

            <Form.Group
              className="m-3"
              as={Row}
              controlId="formGridTakeoffsNight"
            >
              <Form.Label>
                <MoonIcon width="25px" height="25px" />
              </Form.Label>
              <Form.Control
                required
                type="number"
                name="takeoffsNight"
                onChange={this.handleInputChange}
              />
            </Form.Group>

            <Form.Group
              className="m-3"
              as={Row}
              controlId="formGridLandingsDay"
            >
              <Form.Label>
                <SunIcon width="25px" height="25px" />
              </Form.Label>
              <Form.Control
                required
                type="number"
                name="landingsDay"
                onChange={this.handleInputChange}
              />
            </Form.Group>
            <Form.Group
              className="m-3"
              as={Row}
              controlId="formGridLandingsNight"
            >
              <Form.Label>
                <MoonIcon width="25px" height="25px" />
              </Form.Label>
              <Form.Control
                required
                type="number"
                name="landingsNight"
                onChange={this.handleInputChange}
              />
            </Form.Group>
          </Row>

          {/* Fila 4 Single/Multi pilot times SE, ME, MPT */}
          {/* Fila 5 Operational condition time Night, IFR */}
          {/* Fila 6 Pilot function time PIC, Coop, Dual, Instr */}
          {/* Fila 7 Observations*/}
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
)(AerodromeForm);
