import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";

import "./ProfileFollowers.css";

class ProfileFollowers extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
          List of pilots who {followText} {pilot.name}
        </h4>
        {list.map(function(pilot, index) {
          return (
            <Link key={index} to={link.concat(pilot.login)}>
              <li className="followListItem">
                <Row>
                  <Col className="followListCol">
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
                  </Col>
                </Row>
              </li>
            </Link>
          );
        })}
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
