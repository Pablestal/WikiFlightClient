import React, { Component } from "react";
import { Form, Button, Row, Col, Image, Modal } from "react-bootstrap";
import { HTTP } from "../../../common/http-common";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { notify } from "react-notify-toast";
import Loader from "react-loader-spinner";
import MapRoute from "./MapRoute.jsx";
import StarIcon from "../../../icons/Star";
import EmptyStarIcon from "../../../icons/EmptyStar";
import AliceCarousel from "react-alice-carousel";
import ReactDOM from "react-dom";
import { baseURL } from "../../../common/http-common";
import "react-alice-carousel/lib/alice-carousel.css";
import "./RouteDetail.css";

class RouteDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startingImage: 0
    };
  }

  componentDidMount() {
    HTTP.get(`routes/detail/${this.props.match.params.id}`)
      .then(res => {
        const route = res.data;
        res.data.images.sort(function(a, b) {
          return a.id - b.id;
        });

        res.data.comments.sort(function(a, b) {
          return a.id - b.id;
        });

        let imgShowArray = res.data.images.map(
          a =>
            "http://localhost:8080/api/users/image/route" +
            res.data.id +
            "Image" +
            a.id +
            ".jpg"
        );
        this.setState({
          route,
          imagesShow: imgShowArray,
          comment: { ...this.state.comment, route }
        });
      })
      .catch(error => {
        notify.show("Error loading route.", "error", 3000);
        this.goBack();
      });

    if (this.props.authority === "PILOT") {
      HTTP.get(`users/${this.props.login}`)
        .then(res => {
          const pilot = res.data;
          this.setState({ pilot, comment: { ...this.state.comment, pilot } });
        })
        .catch(error => {
          notify.show("Error loading pilot.", "error", 3000);
          this.goBack();
        });
    } else this.setState({ pilot: "ADMIN" });
  }

  goBack = () => {
    this.props.history.goBack();
  };

  ////////// BUTTON SECTION //////////

  deleteRoute = () => {
    const {
      history: { push }
    } = this.props;

    HTTP.delete(`routes/${this.state.route.id}`)
      .then(function(response) {
        notify.show("Route successfully deleted", "success");
        push("/routes");
      })
      .catch(function(error) {
        notify.show("Error deleting route", "error");
      });
  };

  isFavourite = () => {
    const favs = this.state.pilot.favRoutes;
    let fav = false;

    favs.forEach(route => {
      if (route.id === this.state.route.id) {
        fav = true;
      }
    });
    return fav;
  };

  handleFav = () => {
    let favRoutes = this.state.pilot.favRoutes;
    favRoutes.push(this.state.route);
    this.setState({ pilot: { ...this.state.pilot, favRoutes } });

    HTTP.put(`users/${this.props.login}`, this.state.pilot)
      .then(function(response) {
        notify.show("Added to favourites.", "success", 1000);
      })
      .catch(function(error) {
        notify.show("Error.", "error", 3000);
      });
  };

  handleUnfav = () => {
    let favRoutes = this.state.pilot.favRoutes;

    favRoutes.forEach((route, index) => {
      if (route.id === this.state.route.id) {
        favRoutes.splice(index, 1);
      }
    });

    this.setState({ pilot: { ...this.state.pilot, favRoutes } });

    HTTP.put(`users/${this.props.login}`, this.state.pilot)
      .then(function(response) {
        notify.show("Removed from favourites.", "success", 1000);
      })
      .catch(function(error) {
        notify.show("Error.", "error", 3000);
      });
  };

  handleDowloadGPX = () => {
    HTTP.get(`routes/downloadGPX/${this.state.route.id}`)
      .then(res => {
        console.log(res);
      })
      .catch(error => {
        notify.show("Error dowloading GPX file.", "error", 3000);
      });
  };

  renderFavIcon = () => {
    if (this.isFavourite()) {
      return (
        <div className="starDiv" title="Remove from favourites">
          <StarIcon className="starIcon" onClick={this.handleUnfav}></StarIcon>
        </div>
      );
    } else
      return (
        <div className="starDiv" title="Add to favourites">
          <EmptyStarIcon
            className="starIcon"
            onClick={this.handleFav}
          ></EmptyStarIcon>
        </div>
      );
  };

  renderButtonSection() {
    if (!this.props.authenticated || this.props.authority === "ADMIN") {
      //Anonymous buttons
      return (
        <a href="http://localhost:8080/api/routes/downloadGPX/1">
          <Button style={{ margin: "auto" }} variant="route">
            Download GPX
          </Button>
        </a>
      );
    } else if (this.props.login !== this.state.route.pilot.login) {
      //Public route buttons
      return (
        <React.Fragment>
          <a
            style={{ marginRight: "2%" }}
            href="http://localhost:8080/api/routes/downloadGPX/1"
          >
            <Button style={{ margin: "auto" }} variant="route">
              Download GPX
            </Button>
          </a>
          <Link
            to={{
              pathname: `/myLogbook`,
              state: { searchRoute: this.state.route.name }
            }}
          >
            <Button style={{ margin: "auto" }} variant="route">
              Flight list
            </Button>
          </Link>
        </React.Fragment>
      );
    }
    //Own route buttons
    else
      return (
        <React.Fragment>
          <Col>
            <a href="http://localhost:8080/api/routes/downloadGPX/1">
              <Button variant="route">Download GPX</Button>
            </a>
            <Link
              to={{
                pathname: `/myLogbook`,
                state: { searchRoute: this.state.route.name }
              }}
            >
              <Button variant="route">Flight list</Button>
            </Link>
          </Col>
          {this.renderFavIcon()}
          <Col className="ownRouteButtons">
            <Link to={"/routes/edit/" + this.state.route.id}>
              <Button variant="route">Edit</Button>
            </Link>
            <Button variant="route" onClick={this.deleteRoute}>
              Delete
            </Button>
          </Col>
        </React.Fragment>
      );
  }

  ////////// IMAGE SECTION //////////

  renderImageSection() {
    let imagesShow = [];
    for (let index = 0; index < 6; index++) {
      let source;
      if (this.state.imagesShow[index]) {
        source = this.state.imagesShow[index];
        imagesShow.push(
          <Image
            title={this.state.route.images[index].name}
            key={index}
            onClick={() =>
              this.setState({ modalShow: true, startingImage: index })
            }
            className="routeDetailImage"
            src={source}
            alt="image"
            rounded
          />
        );
      } else {
        source = "/images/defaultPic.jpg";
        imagesShow.push(
          <Image
            key={index}
            className="routeDetailNoImage"
            src={source}
            alt="image"
            rounded
          />
        );
      }
    }

    let arr1 = imagesShow.slice(0, 3);
    let arr2 = imagesShow.slice(3, 6);

    let imagesArray = [arr1, arr2];
    return imagesArray;
  }

  getCarouselImages() {
    let arrayShow = [];

    this.state.imagesShow.map((image, index) => {
      let source = this.state.imagesShow[index];
      arrayShow.push(
        <Image
          title={this.state.route.images[index].name}
          key={index}
          onClick={() =>
            this.setState({ modalShow: true, startingImage: index })
          }
          className="routeDetailCarouselImage"
          src={source}
          alt="image"
          rounded
        />
      );
      return null;
    });

    return arrayShow;
  }

  onSlideChanged = e => {
    this.setState({
      startingImage: e.item,
      modalTitle: this.state.route.images[e.item].name
    });
  };

  onInitialized = e => {
    this.setState({ modalTitle: this.state.route.images[e.item].name });
  };

  renderImageCarouselModal() {
    let currentImage = this.state.startingImage;

    return (
      <Modal
        show={this.state.modalShow}
        onHide={this.handleCloseModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Modal.Header closeButton className="routeImageDetail">
          <Modal.Title
            className="modalTitle"
            id="contained-modal-title-vcenter"
          >
            {this.state.modalTitle}
            {/* {this.state.route.images[currentImage].name} */}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="routeImageDetail">
          <AliceCarousel
            className="carouselCSS scrolling"
            items={this.getCarouselImages()}
            fadeOutAnimation={true}
            onInitialized={this.onInitialized}
            disableAutoPlayOnAction={true}
            startIndex={this.state.startingImage}
            showSlideInfo={true}
            onSlideChanged={this.onSlideChanged}
            buttonsDisabled={false}
            dotsDisabled={true}
          />
        </Modal.Body>
        <Modal.Footer className="routeImageDetailFooter">
          <h5>{this.state.route.images[currentImage].description}</h5>
        </Modal.Footer>
      </Modal>
    );
  }

  handleCloseModal = () => {
    this.setState({
      modalShow: false,
      startingImage: 0
    });
  };

  ////////// MAP SECTION //////////

  renderMapSection() {
    const route = this.state.route;
    let start = route.path.coordinates[0];
    let end = route.path.coordinates[route.path.coordinates.length - 1];
    let polyline = route.path.coordinates;
    let bounds;

    bounds = this.getBounds(route);

    return (
      <MapRoute
        bounds={bounds}
        zoom={10}
        imagePaths={this.state.imagesShow}
        images={route.images}
        departure={route.takeoffAerodrome}
        arrival={route.landingAerodrome}
        marker1={start}
        marker2={end}
        polyline={polyline}
      ></MapRoute>
    );
  }

  getBounds(route) {
    let f1 = route.path.coordinates[0];
    let f2 = route.path.coordinates[route.path.coordinates.length - 1];

    return [
      [f1[0], f1[1]],
      [f2[0], f2[1]]
    ];
  }

  ////////// COMMENT SECTION //////////

  handleSubmitComment = () => {
    let comment = this.state.comment;
    let comments = this.state.route.comments;
    ReactDOM.findDOMNode(this.refs.sStrike).value = "";
    if (comment.description) {
      HTTP.post(`/comments`, comment)
        .then(res => {
          comments.push(res.data);
          this.setState({
            route: { ...this.state.route, comments }
          });
          notify.show("Comment added.", "success", 3000);
        })
        .catch(function(error) {
          notify.show("Error uploading route.", "error", 3000);
        });
    } else {
      notify.show("Please add a comment first.", "error", 3000);
    }
  };

  handleDeleteComment = id => {
    let comments = this.state.route.comments;
    comments.map((comment, index) => {
      if (comment.id === id) {
        comments.splice(index, 1);
      }
      return null;
    });
    this.setState({ route: { ...this.state.route, comments } });

    HTTP.delete(`comments/${id}`)
      .then(function(response) {
        notify.show("Comment deleted", "success", 1000);
      })
      .catch(function(error) {
        notify.show("Error deleting comment", "error", 1000);
      });
  };

  handleInputChange = e => {
    this.setState({
      comment: {
        ...this.state.comment,
        [e.target.name]: e.target.value
      }
    });
  };

  renderWriteComment() {
    return (
      <React.Fragment>
        <Form.Label className="commentWriteLabel">
          Add a comment as {this.state.pilot.name} {this.state.pilot.surname1}
        </Form.Label>
        <Form.Control
          ref="sStrike"
          value={this.state.value}
          className="commentForm routeComments"
          rows="5"
          placeholder="Write your comment here..."
          as="textarea"
          name="description"
          onChange={this.handleInputChange}
        />
        <Button
          onClick={this.handleSubmitComment}
          className="btn routeComments"
          variant="comment"
          type="submit"
        >
          Send comment
        </Button>
      </React.Fragment>
    );
  }

  showAvatar(login) {
    let showedAvatar;
    let avatar =
      baseURL + "users/image/" + login + ".jpg?time=" + new Date().getTime();

    showedAvatar = (
      <Link
        className="nameLink"
        to={{
          pathname: `/profile/` + login
        }}
      >
        <Image
          className="commentAvatar"
          onError={e => {
            e.target.onerror = null;
            e.target.src = "/images/default.jpg";
          }}
          src={avatar}
          alt={login + "avatar"}
          fluid
        />
      </Link>
    );
    return showedAvatar;
  }

  renderDeleteComment = (id, commentOwner) => {
    let owner = this.state.route.pilot.login;
    let browser = this.props.login;

    if (
      (browser === owner ||
        browser === commentOwner ||
        this.props.authority === "ADMIN") &&
      this.props.authenticated
    ) {
      return (
        <h6
          className="deleteComment"
          onClick={() => this.handleDeleteComment(id)}
        >
          delete
        </h6>
      );
    } else return null;
  };

  renderCommentList = () => {
    let comments = this.state.route.comments;

    return comments.map((comment, index) => {
      return (
        <div className="routeComments" key={index}>
          <Row>
            <Col md="auto">{this.showAvatar(comment.pilot.login)}</Col>
            <Col>
              <Row>
                <h6>
                  <Link
                    className="nameLink"
                    to={{
                      pathname: `/profile/` + comment.pilot.login
                    }}
                  >
                    <b>
                      {comment.pilot.name} {comment.pilot.surname1}{" "}
                    </b>
                  </Link>
                  on {comment.date}
                </h6>
                &nbsp;&nbsp;&nbsp;
                {this.renderDeleteComment(comment.id, comment.pilot.login)}
              </Row>
              <Row className="commentDescription">
                <h6>{comment.description}</h6>
              </Row>
            </Col>
          </Row>
          <hr></hr>
        </div>
      );
    });
  };

  renderCommentSection() {
    if (this.props.authenticated && this.props.authority === "PILOT") {
      return (
        <React.Fragment>
          {this.renderCommentList()}
          <Row className="routeDetailRow">{this.renderWriteComment()}</Row>
        </React.Fragment>
      );
    } else if (!this.props.authenticated || this.props.authority === "ADMIN") {
      return <React.Fragment>{this.renderCommentList()}</React.Fragment>;
    }
  }

  ////////// RENDER //////////

  renderRouteDetail() {
    let route = this.state.route;
    return (
      <div>
        {/* Buttons */}
        <Row className="routeDetailRow routeButtonsRow">
          {this.renderButtonSection()}
        </Row>
        {/* Map and images */}
        <Row className="routeDetailRow">
          <Col>{this.renderMapSection()}</Col>

          <Col md="auto">{this.renderImageSection()[0]}</Col>
          <Col md="auto"> {this.renderImageSection()[1]}</Col>
        </Row>

        {/* Description */}
        <Row className="routeDetailRow">
          <h4 className="routeDescription">
            Route from{" "}
            <b>
              {route.takeoffAerodrome.city} ({route.takeoffAerodrome.codIATA})
            </b>{" "}
            to{" "}
            <b>
              {route.landingAerodrome.city} ({route.landingAerodrome.codIATA})
            </b>
          </h4>
        </Row>
        <Row>
          <h5 className="routeDescriptionText">{route.description}</h5>
        </Row>

        {/* Comment section */}
        <Row>
          <h3 className="routeComments">Comments ({route.comments.length})</h3>
        </Row>
        {this.renderCommentSection()}
      </div>
    );
  }

  render() {
    if (this.state.route && this.state.pilot) {
      let route = this.state.route;
      return (
        <div className="container">
          {this.renderImageCarouselModal()}
          <h2 className="routeTittle">
            <b>{route.name}</b>
            <Button variant="back" onClick={this.goBack}>
              Back
            </Button>
          </h2>
          <h5 className="routeSubtittle">
            Created on {route.publicationDay} by{" "}
            <Link className="profileLink" to={"/profile/" + route.pilot.login}>
              <b>
                {route.pilot.name} {route.pilot.surname1}
              </b>
            </Link>
          </h5>
          <hr />
          {this.renderRouteDetail()}
        </div>
      );
    } else {
      return (
        <div className="container">
          <h2 className="tittle">Route detail</h2>
          <hr />
          <div className="loader">
            <Loader
              as="span"
              type="Plane"
              color="#6b6630"
              height={20}
              width={20}
            />
          </div>
        </div>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    login: state.auth.login,
    authenticated: state.auth.authenticated,
    authority: state.auth.authority
  };
}

export default connect(mapStateToProps)(RouteDetail);
