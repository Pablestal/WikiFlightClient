import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Row, Image } from "react-bootstrap";
import { baseURL } from "../../../common/http-common";

import "./ProfileFollowers.css";

class ProfileFollowers extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  showAvatar(login) {
    let showedAvatar;
    let avatar =
      baseURL + "users/image/" + login + ".jpg?time=" + new Date().getTime();

    showedAvatar = (
      <Image
        className="followListAvatar"
        onError={e => {
          e.target.onerror = null;
          e.target.src = "/images/default.jpg";
        }}
        src={avatar}
        alt={login + "avatar"}
        fluid
      />
    );
    return showedAvatar;
  }

  renderFollows(pilot, list, listType) {
    let followText;
    let link = "/profile/";
    listType === "following"
      ? (followText = "are followed by")
      : (followText = "follow");
    return (
      <ul className="list">
        <h4 className="tittle">
          <b>
            Pilots who {followText} {pilot.name}
          </b>
        </h4>
        {list.map(function(pilot, index) {
          return (
            <div key={index}>
              <Link to={link.concat(pilot.login)}>
                <li className="followListItem">
                  <Row className="followListCol">
                    <div>{this.showAvatar(pilot.login)}</div>
                    <h5 className="followListText">
                      <b>
                        {pilot.name} {pilot.surname1} {pilot.surname2}
                      </b>{" "}
                      from{" "}
                      <b>
                        {pilot.city} ({pilot.country}
                      </b>
                      )
                    </h5>
                  </Row>
                </li>
              </Link>
              <hr></hr>
            </div>
          );
        }, this)}
      </ul>
    );
  }

  render() {
    let pilot = this.props.pilot;
    let list = [];
    let listType = this.props.follow;
    listType === "following"
      ? (list = pilot.following)
      : (list = pilot.followers);

    if (list.length === 0 && this.props.follow === "following") {
      return (
        <h4 className="tittle">{pilot.name} is not following any pilot. </h4>
      );
    } else if (list.length === 0 && this.props.follow === "followers") {
      return (
        <h4 className="tittle">{pilot.name} is not followed by any pilot. </h4>
      );
    } else {
      return this.renderFollows(pilot, list, listType);
    }
  }
}

export default ProfileFollowers;
