import React, { Component } from "react";
import { HTTP } from "../../../common/http-common";

import { initializeAerAction, deleteAerAction } from "../../../redux/actions";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { notify } from "react-notify-toast";
import Loader from "react-loader-spinner";

class AerodromeList extends Component {
  state = {};

  componentDidMount() {
    HTTP.get("/aerodromes")
      .then(res => {
        const aerodromes = res.data;
        this.props.initializeAerAction(aerodromes);
        this.setState({ aerodromes: res.data });
      })
      .catch(function(error) {
        notify.show("Error in get aerodromes", "error", 2000);
      });
  }

  handleDelete(aerodrome) {
    HTTP.delete(`aerodromes/${aerodrome.id}`)
      .then(response => {
        notify.show("Aerodrome removed", "success", 2000);
        this.props.deleteAerAction(aerodrome);
        this.setState({ aerodromes: this.props.aerodromes });
      })
      .catch(function(error) {
        notify.show("Aerodrome can't be removed", "error", 2000);
      });
  }

  renderEmpty() {
    let rend;
    this.state.aerodromes.length === 0
      ? (rend = <h3 className="empty">List is empty, add some aerodromes.</h3>)
      : (rend = this.renderList());
    return rend;
  }

  renderList() {
    return (
      <ul className="list">
        {this.state.aerodromes.map(function(aerodrome, index) {
          return (
            <li key={index}>
              <h3 className="elem">
                <b>
                  {aerodrome.codOACI} / {aerodrome.codIATA}{" "}
                </b>
                {aerodrome.name} ({aerodrome.city})
                <div className="btns">
                  <Link
                    to={{
                      pathname: `/aerodromes/edit/${aerodrome.id}`,
                      state: { selected: aerodrome }
                    }}
                  >
                    <Button variant="ed" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="del"
                    size="sm"
                    onClick={() => this.handleDelete(aerodrome)}
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
    if (this.state.aerodromes) {
      return (
        <div className="container">
          <h2 className="tittle">List of registered aerodromes</h2>
          <Link
            to={{
              pathname: `/aerodromes/new`,
              state: { selected: "" }
            }}
          >
            <Button variant="new">New</Button>
          </Link>
          <hr />
          {this.renderEmpty()}
        </div>
      );
    } else
      return (
        <div className="container">
          <h2 className="tittle">List of registered aerodromes</h2>
          <Link
            to={{
              pathname: `/aerodromes/new`,
              state: { selected: "" }
            }}
          >
            <Button variant="new">New</Button>
          </Link>
          <hr />
          <div className="loader">
            <Loader
              as="span"
              type="Plane"
              color="#6b6630"
              height={20}
              width={20}
            />
          </div>
        </div>
      );
  }
}

function mapStateToProps(state) {
  return { aerodromes: state.aerod.aerodromes };
}

export default connect(mapStateToProps, {
  initializeAerAction,
  deleteAerAction
})(AerodromeList);
