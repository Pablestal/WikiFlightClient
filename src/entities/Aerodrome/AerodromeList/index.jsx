import React, { Component } from "react";

import { initializeAerAction } from "../../../redux/actions";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

class AerodromeList extends Component {
  state = {
    aerodromes: []
  };

  componentDidMount() {
    this.props.initializeAerAction();
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
                {aerodrome.name}
                <div className="btns">
                  <Link to={`/aerodromes/edit/${aerodrome.id}`}>
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
        <Link to="/aerodromes/new">
          <Button variant="new">New</Button>
        </Link>
        <hr />
        {this.renderEmpty()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(
  mapStateToProps,
  { initializeAerAction }
)(AerodromeList);
