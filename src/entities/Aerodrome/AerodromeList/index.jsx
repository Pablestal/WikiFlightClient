import React, { Component } from "react";
import { HTTP } from "../../../common/http-common";

import { initializeAerAction, deleteAerAction } from "../../../redux/actions";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { notify } from "react-notify-toast";

class AerodromeList extends Component {
  state = {
    aerodromes: []
  };

  componentDidMount() {
    HTTP.get("/aerodromes")
      .then(res => {
        const aerodromes = res.data;
        this.props.initializeAerAction(aerodromes);
      })
      .catch(function(error) {
        notify.show("Error in get aerodromes", "error");
      });
  }

  handleDelete(aerodrome) {
    HTTP.delete(`aerodromes/${aerodrome.id}`)
      .then(function(response) {
        notify.show("Aerodrome removed", "success");
      })
      .catch(function(error) {
        notify.show("Aerodrome cannot be removed", "error");
      });
    this.props.deleteAerAction(aerodrome);
  }

  renderEmpty() {
    let rend;
    this.props.aerodromes.length === 0
      ? (rend = <h3 className="empty">List is empty, add some aerodromes.</h3>)
      : (rend = this.renderList());
    return rend;
  }

  renderList() {
    return (
      <ul className="list">
        {this.props.aerodromes.map(function(aerodrome, index) {
          return (
            <li key={index}>
              <h3 className="elem">
                {aerodrome.name}
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
  }
}

function mapStateToProps(state) {
  return { aerodromes: state.aerod.aerodromes };
}

export default connect(
  mapStateToProps,
  { initializeAerAction, deleteAerAction }
)(AerodromeList);
