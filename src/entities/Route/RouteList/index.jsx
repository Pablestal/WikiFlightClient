import React, { Component } from "react";
import { Button, ButtonGroup, ButtonToolbar, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  initializeRouteAction,
  deleteRouteAction
} from "../../../redux/actions";
import RouteListAll from "./RouteListAll";
import RouteListCreated from "./RouteListCreated";
import RouteListFavourite from "./RouteListFav";

import "./RouteList.css";

class RouteList extends Component {
  constructor(props) {
    super(props);
    this.state = { toggle: "all", tittle: "Public routes" };
  }

  toggleAll = () => {
    this.setState({ toggle: "all", tittle: "Public routes" });
  };

  toggleCreated = () => {
    this.setState({ toggle: "created", tittle: "My routes" });
  };

  toggleFav = () => {
    this.setState({ toggle: "fav", tittle: "My favourite routes" });
  };

  renderRouteListHeader() {
    if (this.props.authenticated === true && this.props.authority === "PILOT") {
      return (
        <div>
          <h2 className="tittle">{this.state.tittle}</h2>
          <Row>
            <Col>
              <ButtonToolbar>
                <ButtonGroup>
                  <Button variant="new" onClick={this.toggleAll}>
                    Public
                  </Button>
                  <Button variant="new" onClick={this.toggleCreated}>
                    My routes
                  </Button>
                  <Button variant="new" onClick={this.toggleFav}>
                    Favourite
                  </Button>
                </ButtonGroup>
              </ButtonToolbar>
            </Col>
            <Col>
              <Link
                to={{
                  pathname: `/routes/new`,
                  state: { selected: "" }
                }}
              >
                <Button variant="new" className="createRouteButton">
                  Create Route
                </Button>
              </Link>
            </Col>
          </Row>
        </div>
      );
    } else {
      return <h2 className="tittle">Route List</h2>;
    }
  }

  renderEmpty() {
    if (this.props.routes.length === 0) {
      if (this.props.authenticated === true) {
        if (this.props.authority === "PILOT") {
          return (
            <h3 className="empty">
              List is empty, be the first to add a route.
            </h3>
          );
        } else
          return (
            <h3 className="empty">
              List is empty, wait for a pilot to add a route.
            </h3>
          );
      } else {
        return (
          <h3 className="empty">
            List is empty,{" "}
            <Link className="reglink" to="/register">
              register
            </Link>{" "}
            and be the first to add a route or{" "}
            <Link className="reglink" to="/login">
              sign in
            </Link>{" "}
            to your account.
          </h3>
        );
      }
    } else return this.renderList();
  }

  renderList() {
    switch (this.state.toggle) {
      case "all":
        return <RouteListAll />;
      case "created":
        return <RouteListCreated />;
      case "fav":
        return <RouteListFavourite />;
      default:
        return <RouteListAll></RouteListAll>;
    }
  }

  render() {
    return (
      <div className="container">
        {this.renderRouteListHeader()}
        <hr />
        {this.renderList()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    login: state.auth.login,
    authority: state.auth.authority,
    routes: state.route.routes
  };
}

export default connect(mapStateToProps, {
  initializeRouteAction,
  deleteRouteAction
})(RouteList);
