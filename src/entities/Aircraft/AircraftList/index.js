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
    this.renderEmpty = this.renderEmpty.bind(this);
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
      })
      .catch(function(error) {
        notify.show("Aircraft cannot be removed", "error");
      });
    this.componentDidMount();
  };

  renderList() {
    return (
      <ul className="list">
        {this.state.aircrafts.map(function(aircraft, index) {
          return (
            <li key={index}>
              <h3>
                <Link to={`/aircrafts/edit/${aircraft.id}`}>
                  <Button variant="outline-warning" size="sm" className="btn ">
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="btn "
                  onClick={() => this.handleDelete(aircraft)}
                >
                  Delete
                </Button>
                {aircraft.manufacturer} {aircraft.model}
              </h3>
            </li>
          );
        }, this)}
      </ul>
    );
  }

  renderEmpty() {
    let rend;
    this.state.aircrafts.length === 0
      ? (rend = <h3 className="empty">List is empty, add some aircrafts.</h3>)
      : (rend = this.renderList());
    return rend;
  }

  render() {
    return (
      <div className="container">
        <Link to="/aircrafts/new">
          <Button variant="light">New</Button>
        </Link>
        {this.renderEmpty()}
      </div>
    );
  }
}

export default withRouter(AircraftList);
