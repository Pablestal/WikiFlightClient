import React, { Component } from "react";
import { Button, ButtonGroup, ButtonToolbar, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { HTTP } from "../../../common/http-common";
import { connect } from "react-redux";
import { notify } from "react-notify-toast";
import {
  initializeRouteAction,
  deleteRouteAction
} from "../../../redux/actions";

import "./RouteList.css";

class RouteList extends Component {
  constructor(props) {
    super(props);
    this.state = { toggle: "all" };
  }

  componentDidMount() {
    HTTP.get(`/routes`)
      .then(res => {
        const routes = res.data;
        this.props.initializeRouteAction(routes);
      })
      .catch(function(error) {
        notify.show("Error loading routes", "error");
      });
  }

  toggleAll() {
    this.setState({ toggle: "all" });
  }

  toggleCreated() {
    this.setState({ toggle: "created" });
  }

  toggleFav() {
    this.setState({ toggle: "fav" });
  }

  renderRouteListHeader() {
    if (this.props.authenticated === true && this.props.authority === "PILOT") {
      return (
        <div>
          <h2 className="tittle">Route List</h2>
          <Row>
            <Col>
              <ButtonToolbar>
                <ButtonGroup>
                  <Button variant="new" onClick={this.toggleStats}>
                    All
                  </Button>
                  <Button variant="new" onClick={this.toggleInfo}>
                    Created
                  </Button>
                  <Button variant="new" onClick={this.toggleRoutes}>
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

  renderList() {}

  render() {
    return (
      <div className="container">
        {this.renderRouteListHeader()}
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
    routes: state.route.routes
  };
}

export default connect(mapStateToProps, {
  initializeRouteAction,
  deleteRouteAction
})(RouteList);
