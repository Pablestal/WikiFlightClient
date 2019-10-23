import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import "./AircraftList.css";
import { HTTP } from "../../../common/http-common";
import { initializeAircAction, deleteAircAction } from "../../../redux/actions";
import { connect } from "react-redux";
import { notify } from "react-notify-toast";

class AircraftList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      aircrafts: []
    };
  }

  componentDidMount() {
    HTTP.get("/aircrafts")
      .then(res => {
        const aircrafts = res.data;
        this.props.initializeAircAction(aircrafts);
      })
      .catch(function(error) {
        notify.show("Error loading aircrafts.", "error");
      });
  }
  handleDelete(aircraft) {
    HTTP.delete(`aircrafts/${aircraft.id}`)
      .then(function(response) {
        notify.show("Aircraft removed", "success");
      })
      .catch(function(error) {
        notify.show("Aircraft cannot be removed", "error");
      });
    this.props.deleteAircAction(aircraft);
  }

  renderEmpty() {
    let rend;
    this.props.aircrafts.length === 0
      ? (rend = <h3 className="empty">List is empty, add some aircrafts.</h3>)
      : (rend = this.renderList());
    return rend;
  }

  renderList() {
    return (
      <ul className="list">
        {this.props.aircrafts.map(function(aircraft, index) {
          return (
            <li key={index}>
              <h3 className="elem">
                {aircraft.manufacturer} <b>{aircraft.model}</b>
                <div className="btns">
                  <Link
                    to={{
                      pathname: `/aircrafts/edit/${aircraft.id}`,
                      state: { selected: aircraft }
                    }}
                  >
                    <Button variant="ed" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="del"
                    size="sm"
                    onClick={() => this.handleDelete(aircraft)}
                  >
                    Delete
                  </Button>
                </div>
              </h3>
            </li>
          );
        }, this)}
      </ul>
    );
  }

  render() {
    return (
      <div className="container">
        <h2 className="tittle">List of registered aircrafts</h2>

        <Link
          to={{
            pathname: `/aircrafts/new`,
            state: { selected: "" }
          }}
        >
          <Button variant="new">New</Button>
        </Link>
        <hr />
        {this.renderEmpty()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { aircrafts: state.airc.aircrafts };
}

export default connect(
  mapStateToProps,
  { initializeAircAction, deleteAircAction }
)(AircraftList);
