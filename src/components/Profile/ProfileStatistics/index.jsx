import React, { Component } from "react";
import { HTTP } from "../../../common/http-common";
import { notify } from "react-notify-toast";
import Loader from "react-loader-spinner";
import { Row, Col } from "react-bootstrap";
import "../Profile.css";

class ProfileStatistics extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    HTTP.get(`flights/${this.props.pilot.login}`)
      .then(res => {
        const flights = res.data;
        this.setState({ flights });
      })
      .catch(function(error) {
        notify.show("Error loading flights", "error");
      });
  }

  getMostCommon(array) {
    var count = {};
    array.forEach(function(a) {
      count[a] = (count[a] || 0) + 1;
    });
    return Object.keys(count).reduce(function(r, k, i) {
      if (!i || count[k] > count[r[0]]) {
        return [k];
      }
      if (count[k] === count[r[0]]) {
        r.push(k);
      }
      return r;
    }, []);
  }

  getMostUsed = () => {
    if (this.state.flights) {
      let flights = this.state.flights;
      let aer = [];
      let aircmod = [];
      let aircman = [];

      flights.forEach(function(flight) {
        aer.push(flight.takeoffAerodrome.name);
        aer.push(flight.takeoffAerodrome.name);
        aircmod.push(flight.aircraft.model);
        aircman.push(flight.aircraft.manufacturer);
      });
      let mcaer = this.getMostCommon(aer)[0];
      let mcaircman = this.getMostCommon(aircman);
      let mcaircmod = this.getMostCommon(aircmod);

      return [mcaer, mcaircman, mcaircmod];
    }
    return ["", "", ""];
  };

  getShortestFlight() {
    if (this.state.flights) {
      let flights = this.state.flights;
      let shortest = 1600;

      flights.forEach(function(flight) {
        if (flight.totalTime < shortest) {
          shortest = flight.totalTime;
        }
      });
      return shortest;
    }
  }

  getLongestFlight() {
    if (this.state.flights) {
      let flights = this.state.flights;
      let longest = 0;

      flights.forEach(function(flight) {
        if (flight.totalTime > longest) {
          longest = flight.totalTime;
        }
      });
      return longest;
    }
  }

  getAverageTime() {
    if (this.state.flights) {
      let flights = this.state.flights;
      let sum = 0;

      flights.forEach(function(flight) {
        sum += flight.totalTime;
      });
      return sum / flights.length;
    }
  }

  renderStats() {
    return (
      <Row>
        <Col>
          <h5>
            Number of Flights: <b>{this.state.flights.length} </b>
          </h5>
          <h5>
            Average Flight Time: <b>{this.getAverageTime()} minutes</b>
          </h5>
          <h5>
            Longest Flight Time: <b>{this.getLongestFlight()} minutes</b>
          </h5>
          <h5>
            Shortest Flight Time: <b>{this.getShortestFlight()} minutes</b>
          </h5>
        </Col>
        <Col>
          <h5>
            Most Used Aerodrome: <b>{this.getMostUsed()[0]}</b>
          </h5>
          <h5>
            Most Used Aircraft Manufacturer: <b>{this.getMostUsed()[1][0]}</b>
          </h5>
          <h5>
            Number of Uploaded Routes:{" "}
            <b>{this.props.pilot.createdRoutes.length}</b>
          </h5>
          <h5>
            Number of Favourite Routes:{" "}
            <b>{this.props.pilot.favRoutes.length}</b>
          </h5>
        </Col>
      </Row>
    );
  }

  render() {
    if (this.state.flights) {
      if (this.state.flights.length !== 0) {
        return (
          <div>
            <Row>
              <Col>
                <h4 className="tittle">
                  {this.props.pilot.name} {this.props.pilot.surname1} statistics
                </h4>
              </Col>
            </Row>
            {this.renderStats()}
          </div>
        );
      } else
        return (
          <div>
            <h4 className="tittle">{this.props.pilot.name} didn't fly yet.</h4>
          </div>
        );
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

export default ProfileStatistics;
