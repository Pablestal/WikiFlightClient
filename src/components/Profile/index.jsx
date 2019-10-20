import React, { Component } from "react";

import { connect } from "react-redux";
import { ButtonToolbar, ButtonGroup } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { HTTP } from "../../common/http-common";
import { notify } from "react-notify-toast";
import ProfileEdit from "./ProfileEdit";
import ProfileInfo from "./ProfileInfo";
import "./Profile.css";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = { pilot: {}, toggle: "info" };
    this.toggleRoutes = this.toggleRoutes.bind(this);
    this.toggleStats = this.toggleStats.bind(this);
    this.toggleInfo = this.toggleInfo.bind(this);
    this.toggleSettings = this.toggleSettings.bind(this);
  }

  componentDidMount() {
    HTTP.get(`users/${this.props.login}`)
      .then(res => {
        const pilot = res.data;
        this.setState({ pilot });
      })
      .catch(function(error) {
        notify.show("You are not allowed here", "error");
      });
  }

  toggleInfo() {
    this.setState({ toggle: "info" });
  }

  toggleStats() {
    this.setState({ toggle: "stats" });
  }

  toggleRoutes() {
    this.setState({ toggle: "routes" });
  }

  toggleSettings() {
    this.setState({ toggle: "settings" });
  }

  toggleRender() {
    switch (this.state.toggle) {
      case "info":
        return <ProfileInfo></ProfileInfo>;
      case "routes":
        return <ProfileInfo></ProfileInfo>;
      case "stats":
        return <ProfileInfo></ProfileInfo>;
      case "settings":
        return <ProfileEdit></ProfileEdit>;
      default:
        return <ProfileInfo></ProfileInfo>;
    }
  }

  render() {
    const pilot = this.state.pilot;
    return (
      <div className="container">
        <h2 className="tittle">
          <b>
            {pilot.name} {pilot.surname1} {pilot.surname2}
          </b>
        </h2>
        <ButtonToolbar>
          <ButtonGroup>
            <Button variant="new" onClick={this.toggleInfo}>
              Info
            </Button>
            <Button variant="new" onClick={this.toggleRoutes}>
              Routes
            </Button>
            <Button variant="new" onClick={this.toggleStats}>
              Statistics
            </Button>
            <Button variant="new" onClick={this.toggleSettings}>
              Settings
            </Button>
          </ButtonGroup>
        </ButtonToolbar>
        <hr />
        {this.toggleRender()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    login: state.auth.login,
    authority: state.auth.authority
  };
}

export default connect(mapStateToProps)(Profile);
