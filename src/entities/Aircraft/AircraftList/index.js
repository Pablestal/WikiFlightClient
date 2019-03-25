import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import "./AircraftList.css";
import { HTTP } from "../../../common/http-common";
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
    HTTP.get(`/aircrafts`).then(res => {
      const aircrafts = res.data;
      this.setState({ aircrafts });
    });
  }

  // handleDelete = id => {
  //   event.preventDefault();
  //   axios.delete("http://localhost:8080/api/aircrafts/", { params: { id } });
  //   console.log(event);
  // };

  handleDelete = async aircraft => {
    await HTTP.delete("/aircrafts", {
      params: { id: aircraft.id }
    })
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        notify.show("Aircraft cannot be removed", error);
      });
    // const aircrafts = this.state.aircrafts.filter(p => p.id !== aircraft.id);
    // this.setState({ aircrafts });
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

export default AircraftList;
