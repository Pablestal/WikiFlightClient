import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Table } from "react-bootstrap";
import { HTTP } from "../../../common/http-common";
import { connect } from "react-redux";
import { notify } from "react-notify-toast";
import "./FlightList.css";
import EditIcon from "../../../icons/Edit";
import DeleteIcon from "../../../icons/Delete";
import { initializeFliAction, deleteFliAction } from "../../../redux/actions";

class FlightList extends Component {
  constructor(props) {
    super(props);

    this.handleDelete = this.handleDelete.bind(this);
    this.renderEmpty = this.renderEmpty.bind(this);
  }

  componentDidMount() {
    HTTP.get(`flights/${this.props.login}`)
      .then(res => {
        const flights = res.data;
        this.props.initializeFliAction(flights);
      })
      .catch(function(error) {
        notify.show("Error loading flights", "error");
      });
  }

  handleDelete(flight) {
    HTTP.delete(`flights/${flight.id}`)
      .then(function(response) {
        notify.show("Flight removed", "success");
      })
      .catch(function(error) {
        notify.show("Flight cannot be removed", "error");
      });
    this.props.deleteFliAction(flight);
  }

  renderViewRouter(flight) {
    let rend;
    flight.route
      ? (rend = (
          <u>
            <Link
              to={{
                pathname: `routes/${flight.route}`,
                selected: flight
              }}
            >
              View Route
            </Link>
          </u>
        ))
      : (rend = "No route");
    return rend;
  }

  renderList() {
    return (
      <Table hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>DATE</th>
            <th>TAKEOFF</th>
            <th>LANDING</th>
            <th>DETAIL</th>
            <th>ROUTE</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {this.props.flights.map(function(flight, index) {
            return (
              <tr key={index}>
                <td>{flight.id}</td>
                <td>{flight.departureTime}</td>
                <td>{flight.takeoffAerodrome.codIATA}</td>
                <td>{flight.landingAerodrome.codIATA} </td>
                <td>
                  <u>
                    <Link
                      to={{
                        pathname: `flights/${flight.id}`,
                        selected: flight
                      }}
                    >
                      View Detail
                    </Link>
                  </u>
                </td>
                <td>{this.renderViewRouter(flight)}</td>
                <td className="actionsTable">
                  <Link
                    title="Edit"
                    to={{
                      pathname: `/flights/edit/${flight.id}`,
                      state: { selected: flight }
                    }}
                  >
                    <EditIcon
                      className="editIcon"
                      width="25px"
                      height="25px"
                    ></EditIcon>
                  </Link>
                  <div title="Delete Flight">
                    <DeleteIcon
                      className="deleteIcon"
                      onClick={() => this.handleDelete(flight)}
                      width="25px"
                      height="25px"
                    ></DeleteIcon>
                  </div>
                </td>
              </tr>
            );
          }, this)}
        </tbody>
      </Table>
    );
  }

  renderEmpty() {
    let rend;
    this.props.flights.length === 0
      ? (rend = <h3 className="empty">List is empty, add a flight.</h3>)
      : (rend = this.renderList());
    return rend;
  }

  render() {
    return (
      <div className="container">
        <h2 className="tittle">My logbook</h2>

        <Link
          to={{
            pathname: `/flights/new`,
            state: { selected: "" }
          }}
        >
          <Button variant="new">New Flight</Button>
          <Button className="csvButton" variant="new">
            Download CSV
          </Button>
        </Link>
        <hr />
        {this.renderEmpty()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    login: state.auth.login,
    authority: state.auth.authority,
    flights: state.flight.flights
  };
}

export default connect(
  mapStateToProps,
  { initializeFliAction, deleteFliAction }
)(FlightList);
