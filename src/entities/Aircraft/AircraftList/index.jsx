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
      aircrafts: [],
      selectedOption: []
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.renderEmpty = this.renderEmpty.bind(this);
  }

  componentDidMount() {
    HTTP.get("/aircrafts")
      .then(res => {
        const aircrafts = res.data;
        this.setState({ aircrafts });
      })
      .catch(function(error) {
        notify.show("You are not allowed here", "error");
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
              <h3 className="elem">
                {aircraft.manufacturer} <b>{aircraft.model}</b>
                <div className="btns">
                  <Link to={`/aircrafts/edit/${aircraft.id}`}>
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
        <h2 className="tittle">List of registered aircrafts</h2>

        <Link to="/aircrafts/new">
          <Button variant="new">New</Button>
        </Link>
        <hr />
        {this.renderEmpty()}
      </div>
    );
  }
}

export default withRouter(AircraftList);
