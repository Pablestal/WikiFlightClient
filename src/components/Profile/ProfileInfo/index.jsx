import React, { Component } from "react";

import { connect } from "react-redux";
import { Col, Row, Image } from "react-bootstrap";
import { HTTP } from "../../../common/http-common";
import { notify } from "react-notify-toast";
import ImageUploader from "react-images-upload";
import CardIcon from "../../../icons/Card";
import HomeIcon from "../../../icons/Home";
import CakeIcon from "../../../icons/Cake";

class ProfileInfo extends Component {
  constructor(props) {
    super(props);
    this.state = { pilot: {} };
    this.onDrop = this.onDrop.bind(this);
    this.showAvatar = this.showAvatar.bind(this);
  }

  componentDidMount() {
    this.setState({
      avatar: this.props.avatar + new Date().getTime()
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.avatar !== prevProps.avatar) {
      this.componentDidMount();
    }
  }

  onDrop = async picture => {
    this.setState({
      picture: picture
    });

    const image = picture[picture.length - 1];

    var formData = new FormData();
    formData.append("image", image, this.props.login + ".jpg");

    await HTTP.put(`users/updateavatar/${this.props.login}`, formData, {
      "Content-Type": "multipart/form-data"
    })
      .then(function(response) {
        notify.show("Successfully modified", "success", 3000);
      })
      .catch(function(error) {
        notify.show("Can`t modify", "error", 3000);
      });
    this.componentDidMount();
  };

  showAvatar(login) {
    let showedAvatar;
    showedAvatar = (
      <Image
        className="avatar"
        onError={e => {
          e.target.onerror = null;
          e.target.src = "/images/default.jpg";
        }}
        src={this.state.avatar}
        alt={login + "avatar"}
        rounded
      />
    );
    return showedAvatar;
  }

  renderChangeAvatar() {
    if (
      this.props.authenticated &&
      this.props.login === this.props.pilot.login
    ) {
      return (
        <Row>
          <ImageUploader
            withIcon={false}
            buttonText="Change avatar"
            onChange={this.onDrop}
            imgExtension={[".jpg", ".jpeg"]}
            maxFileSize={5242880}
            singleImage={true}
            withLabel={false}
            fileTypeError="File extension not supported"
          />
        </Row>
      );
    }
  }

  render() {
    const pilot = this.props.pilot;

    return (
      <Row className="profRow">
        <Col xs={2}>
          <Row>{this.showAvatar(pilot.login)}</Row>
          {this.renderChangeAvatar(pilot)}
        </Col>
        <Col className="profCol">
          <Row>
            <CardIcon className="profIcon" width="30px" height="30px" />{" "}
            <h4>
              {pilot.name} {pilot.surname1} {pilot.surname2}
            </h4>
          </Row>
          <Row className="profRow">
            <HomeIcon className="profIcon" width="30px" height="30px" />
            <h4>
              {pilot.city} ({pilot.country})
            </h4>
          </Row>
          <Row className="profRow">
            <CakeIcon className="profIcon" width="30px" height="30px" />
            <h4> {pilot.birthDate}</h4>
          </Row>
          <Row className="profRow">
            <h4>
              <b>User since:</b> {pilot.regisDate}
            </h4>
          </Row>
        </Col>
      </Row>
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

export default connect(mapStateToProps)(ProfileInfo);
