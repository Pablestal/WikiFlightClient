import React, { Component } from "react";
import { HTTP } from "../../../common/http-common";
import { notify } from "react-notify-toast";
import { connect } from "react-redux";
import { Image, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import Loader from "react-loader-spinner";
import "./ProfileRoutes.css";

class ProfileRoutes extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (this.props.login === this.props.pilot.login) {
      HTTP.get(`users/${this.props.login}`)
        .then(res => {
          const routes = res.data.createdRoutes;
          this.setState({ routes });
        })
        .catch(function(error) {
          notify.show("Error loading pilot routes", "error");
        });
    } else {
      HTTP.get(`routes`)
        .then(res => {
          const routes = res.data;
          this.setState({ routes });
        })
        .catch(function(error) {
          notify.show("Error loading public routes", "error");
        });
    }
  }

  showImages(route) {
    let imagesShow = [];
    for (let index = 0; index < 5; index++) {
      let source;
      route.images[index]
        ? (source =
            "http://localhost:8080/api/users/image/route" +
            route.id +
            "Image" +
            route.images[index].id +
            ".jpg")
        : (source = "/images/defaultPic.jpg");

      imagesShow.push(
        <Image
          key={index}
          onClick={this.addImageOpenModal}
          className="profileRoutesImage"
          src={source}
          alt="avatar"
          rounded
        />
      );
    }

    return imagesShow;
  }

  renderLogedRoutes() {
    let routesArr = this.state.routes;
    let link = "/routes/edit/";

    if (routesArr) {
      if (routesArr.length === 0) {
        return (
          <h3 className="profileRoutesEmpty">
            List is empty, create a new route.
          </h3>
        );
      } else {
        let routes = routesArr.sort(routesArr.id);

        return (
          <div>
            <ul className="list">
              {routes.map(function(route, index) {
                return (
                  <div key={index}>
                    <Link to={link.concat(route.id)}>
                      <li className="profileRoutesItem">
                        <Row className="profileRoutesRow">
                          <Col>
                            <h5 className="profileRoutesTittle">
                              <u>
                                <b>{route.name}</b>
                              </u>
                            </h5>
                            <p className="profileRoutesText">
                              {route.description}
                            </p>
                          </Col>
                          <Col>
                            <Row>{this.showImages(route)}</Row>
                          </Col>
                        </Row>
                      </li>
                    </Link>
                    <hr></hr>
                  </div>
                );
              }, this)}
            </ul>
          </div>
        );
      }
    } else
      return (
        <div className="loader">
          <Loader
            as="span"
            type="Plane"
            color="#6b6630"
            height={20}
            width={20}
          />
        </div>
      );
  }

  renderPublicRoutes() {
    let routesArr = this.state.routes;
    let link = "/routes/edit/";
    console.log(routesArr);
    if (routesArr) {
      if (routesArr.length === 0) {
        return (
          <h3 className="profileRoutesEmpty">
            This user didn't publish any route.
          </h3>
        );
      } else {
        let routes = routesArr.sort(routesArr.id);

        return (
          <div>
            <ul className="list">
              {routes.map(function(route, index) {
                if (route.pilot.login === this.props.pilot.login) {
                  return (
                    <div key={index}>
                      <Link to={link.concat(route.id)}>
                        <li className="profileRoutesItem">
                          <Row className="profileRoutesRow">
                            <Col>
                              <h5 className="profileRoutesText">
                                <b>{route.name}</b>
                              </h5>
                              <p className="profileRoutesText">
                                {route.description}
                              </p>
                            </Col>
                            <Col>
                              <Row>{this.showImages(route)}</Row>
                            </Col>
                          </Row>
                        </li>
                      </Link>
                      <hr></hr>
                    </div>
                  );
                } else return null;
              }, this)}
            </ul>
          </div>
        );
      }
    } else
      return (
        <div className="loader">
          <Loader
            as="span"
            type="Plane"
            color="#6b6630"
            height={20}
            width={20}
          />
        </div>
      );
  }

  renderRouteList() {
    if (this.props.login === this.props.pilot.login) {
      return this.renderLogedRoutes();
    } else return this.renderPublicRoutes();
  }

  render() {
    let pilot = this.props.pilot;
    let text;

    pilot.login === this.props.login
      ? (text = <h4 className="tittle">Routes created by you</h4>)
      : (text = (
          <h4 className="tittle">
            Routes published by {pilot.name} {pilot.surname1}
          </h4>
        ));

    return (
      <div>
        {text}
        {this.renderRouteList()}
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

export default connect(mapStateToProps)(ProfileRoutes);
