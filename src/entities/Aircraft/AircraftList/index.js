import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import "./AircraftList.css";
import { HTTP } from "../../../common/http-common";
import { withRouter } from "react-router";
import { notify } from "react-notify-toast";

class AircraftList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      aircrafts: []
    };
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    HTTP.get("/aircrafts").then(res => {
      const aircrafts = res.data;
      this.setState({ aircrafts });
    });
  }

  updateAircrafts(aircraft) {
    const aircrafts = this.state.aircrafts.filter(p => p.id !== aircraft.id);
    this.setState({ aircrafts });
  }

  handleDelete = async aircraft => {
    await HTTP.delete("/aircrafts/$(aircraft.id)", {
      params: { id: aircraft.id }
    })
      .then(function(response) {
        notify.show("Aircraft removed", "success");
        console.log(response);
        this.updateAircrafts(aircraft);
      })
      .catch(function(error) {
        notify.show("Aircraft cannot be removed", "error");
      });
  };

  render() {
    return (
      <div className="container">
        <Link to="/aircrafts/new">
          <Button variant="light">New</Button>
        </Link>
        <ul className="list">
          {this.state.aircrafts.map(function(aircraft, index) {
            return (
              <li key={index}>
                <h3>
                  {aircraft.manufacturer} {aircraft.model}
                  <Button onClick={() => this.handleDelete(aircraft)}>
                    Delete
                  </Button>
                </h3>
              </li>
            );
          }, this)}
        </ul>
      </div>
    );
  }
}

export default withRouter(AircraftList);
