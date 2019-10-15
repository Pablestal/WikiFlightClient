import React, { Component } from "react";

import { connect } from "react-redux";
import { signOutAction } from "../../redux/actions";
import { ButtonGroup, ButtonToolbar } from "react-bootstrap";
import { Button, Col, Row, Container, Image } from "react-bootstrap";
import { HTTP } from "../../common/http-common";
import { notify } from "react-notify-toast";
import { Link } from "react-router-dom";
import ImageUploader from "react-images-upload";

import "./Profile.css";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = { picture: "", pilot: {}, avatar: "" };
    this.onDrop = this.onDrop.bind(this);
    this.showAvatar = this.showAvatar.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  goBack() {
    this.props.history.goBack();
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

  onDrop(picture) {
    this.setState({
      picture: picture
    });
    const image = picture[picture.length - 1];

    var formData = new FormData();
    formData.append("image", image);

    let pilot = this.state.pilot;

    formData.append("pilot", pilot);
    HTTP.put(`users/updateavatar/${this.props.login}`, formData, {
      "Content-Type": "multipart/form-data"
    })
      .then(function(response) {
        notify.show("Successfully modified", "success", 3000);
      })
      .catch(function(error) {
        notify.show("Can`t modify", "error", 3000);
      });
  }

  showAvatar() {
    let showedAvatar;
    const myavatar =
      "/images/avatars/" +
      this.state.pilot.login +
      "avatar.jpg?t=" +
      new Date().getTime();
    showedAvatar = (
      <Image
        className="avatar"
        onError={e => {
          e.target.onerror = null;
          e.target.src = "/images/default.jpg";
        }}
        src={myavatar}
        alt={this.state.pilot.login + "avatar"}
        rounded
      />
    );
    return showedAvatar;
  }

  render() {
    const pilot = this.state.pilot;

    return (
      <div className="container">
        <h2 className="tittle">
          <b>
            {pilot.name} {pilot.surname1} {pilot.surname2}
          </b>
          <Button variant="back" onClick={this.goBack}>
            Back
          </Button>
        </h2>
        <ButtonToolbar>
          <ButtonGroup>
            <Button variant="new">Info</Button>
            <Button variant="new">Routes uploaded</Button>
            <Button variant="new">Statistics</Button>
            <Link
              to={{
                pathname: `/profile/${this.props.login}/editData`,
                state: { selected: pilot }
              }}
            >
              <Button variant="new" className="profEditButton">
                Settings
              </Button>
            </Link>
          </ButtonGroup>
        </ButtonToolbar>
        <hr />

        <Container className="dataContainer">
          <Row>
            <Col xs={2}>
              <Row>{this.showAvatar()}</Row>
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
            </Col>
            <Col className="profCol">
              <Row className="profrow">
                <Col>
                  <h2>
                    {pilot.city} ({pilot.country})
                  </h2>
                </Col>
                <Col>
                  <h2>Birth date: {pilot.birthDate}</h2>
                </Col>
              </Row>
              <Row className="profrow">
                <Col>
                  <h2>User since: {pilot.regisDate}</h2>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
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

export default connect(
  mapStateToProps,
  { signOutAction }
)(Profile);
