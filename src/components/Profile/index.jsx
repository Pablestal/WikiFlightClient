import React, { Component } from "react";

import { connect } from "react-redux";
import { ButtonToolbar, ButtonGroup, Row, Col } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { HTTP } from "../../common/http-common";
import { baseURL } from "../../common/http-common";
import { notify } from "react-notify-toast";
import ProfileEdit from "./ProfileEdit";
import ProfileInfo from "./ProfileInfo";
import ProfileFollowers from "./ProfileFollowers";
import ProfileStatistics from "./ProfileStatistics";
import "./Profile.css";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = { pilot: "", toggle: "info", isFollower: false };
    this.toggleRoutes = this.toggleRoutes.bind(this);
    this.toggleStats = this.toggleStats.bind(this);
    this.toggleInfo = this.toggleInfo.bind(this);
    this.toggleSettings = this.toggleSettings.bind(this);
    this.toggleFollowers = this.toggleFollowers.bind(this);
    this.toggleFollowing = this.toggleFollowing.bind(this);
    this.handleFollow = this.handleFollow.bind(this);
    this.handleUnfollow = this.handleUnfollow.bind(this);
  }

  componentDidMount() {
    HTTP.get(`users/${this.props.match.params.login}`)
      .then(res => {
        const pilot = res.data;
        this.setState({
          pilot,
          toggle: "info",
          avatar:
            baseURL +
            "users/image/" +
            pilot.login +
            ".jpg?time=" +
            new Date().getTime()
        });
      })
      .catch(function(error) {
        notify.show("You are not allowed here", "error");
      });
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.login !== prevProps.match.params.login) {
      this.componentDidMount();
    }
  }

  followUser(login) {
    const pilot = this.state.pilot;

    HTTP.put(`users/${login}`, pilot)
      .then(function(response) {})
      .catch(function(error) {
        notify.show("Error.", "error", 3000);
      });
  }

  getFollowerData = async () => {
    const res = await HTTP.get(`users/${this.props.login}`);
    return res.data;
  };

  handleFollow = async () => {
    const followers = this.state.pilot.followers;
    const myData = await this.getFollowerData();
    followers.push(myData);
    this.setState({
      pilot: {
        ...this.state.pilot,
        followers
      }
    });

    this.followUser(this.state.pilot.login);
  };

  handleUnfollow = async () => {
    const followers = this.state.pilot.followers;
    const myData = await this.getFollowerData();

    followers.forEach(function(pilot, index) {
      if (pilot.login === myData.login) {
        followers.splice(index, 1);
      }
    });

    this.setState({
      pilot: {
        ...this.state.pilot,
        followers
      }
    });

    this.followUser(this.state.pilot.login);
  };

  toggleInfo() {
    this.setState({ toggle: "info" });
    this.componentDidMount();
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

  toggleFollowing = () => {
    this.setState({ toggle: "following" });
  };

  toggleFollowers() {
    this.setState({ toggle: "followers" });
  }

  toggleRender(pilot) {
    let avatar = null;
    avatar = this.state.avatar;

    if (pilot) {
      // console.log(avatar);
      switch (this.state.toggle) {
        case "info":
          return <ProfileInfo pilot={pilot} avatar={avatar} />;
        case "routes":
          return <ProfileInfo pilot={pilot} avatar={avatar} />;
        case "stats":
          return <ProfileStatistics pilot={pilot} />;
        case "settings":
          return <ProfileEdit pilot={pilot} />;
        case "following":
          return <ProfileFollowers pilot={pilot} follow="following" />;
        case "followers":
          return <ProfileFollowers pilot={pilot} follow="followers" />;
        default:
          return <ProfileInfo pilot={pilot}></ProfileInfo>;
      }
    }
  }

  renderButtonBar() {
    if (
      this.props.authenticated &&
      this.props.login === this.props.match.params.login
    ) {
      return (
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
      );
    } else {
      return (
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
          </ButtonGroup>
        </ButtonToolbar>
      );
    }
  }

  isFollower(plogin) {
    const followers = this.state.pilot.followers;
    let follower = false;
    followers.forEach(function(pilot) {
      if (pilot.login === plogin) {
        follower = true;
      }
    });
    return follower;
  }

  renderFollowButton() {
    const isFollower = this.isFollower(this.props.login);
    let render;
    if (
      this.props.authenticated &&
      this.props.match.params.login !== this.props.login
    ) {
      !isFollower
        ? (render = (
            <Button
              variant="follow"
              className="followButton"
              onClick={this.handleFollow}
            >
              Follow
            </Button>
          ))
        : (render = (
            <Button
              variant="unfollow"
              className="followButton"
              onClick={this.handleUnfollow}
            >
              Unfollow
            </Button>
          ));
    }
    return render;
  }

  render() {
    const pilot = this.state.pilot;
    let rend;
    let followers;
    let followed;
    if (pilot) {
      followers = pilot.followers.length;
      followed = pilot.following.length;
      rend = this.renderFollowButton();
    } else {
      followers = "...";
      followed = "...";
      rend = "Loading...";
    }
    return (
      <div className="container">
        <h2 className="tittle">
          <b>
            {pilot.name} {pilot.surname1} {pilot.surname2}
          </b>
        </h2>
        <Row>
          <Col className="buttonBarCol">{this.renderButtonBar()}</Col>
          <Col className="followCol" xs={1.5} onClick={this.toggleFollowers}>
            <h4 className="followCont tittle">
              <b>{followers}</b>
            </h4>
            <h5 className="followCont tittle">Followers</h5>
          </Col>
          <Col className="followCol1" xs={1.5} onClick={this.toggleFollowing}>
            <h4 className="followCont tittle">
              <b>{followed}</b>
            </h4>
            <h5 className="followCont tittle">Following</h5>
          </Col>
          <Col className="followCol">{rend}</Col>
        </Row>
        <hr />
        {this.toggleRender(pilot)}
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
