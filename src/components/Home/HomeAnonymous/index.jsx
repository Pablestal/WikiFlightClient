import React, { Component } from "react";
import { Image, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { notify } from "react-notify-toast";
import { HTTP } from "../../../common/http-common";
import Loader from "react-loader-spinner";
import MapHome from "../MapHome";
import "./HomeAnonymous.css";

class HomeAnonymous extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    HTTP.get(`routes`)
      .then(res => {
        const routes = res.data;
        routes.map(route => {
          route.images.sort(function(a, b) {
            return a.id - b.id;
          });
          return null;
        });
        routes.sort(function(a, b) {
          return b.id - a.id;
        });

        this.setState({ routes });
      })
      .catch(function(error) {
        notify.show("Error loading public routes", "error");
      });
  }

  showImages(route) {
    let imagesShow = [];
    for (let index = 0; index < 4; index++) {
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

  renderRouteList() {
    let routesArr = this.state.routes;
    let routes = [routesArr[0], routesArr[1], routesArr[2]];
    let link = "/routes/detail/";

    return (
      <div>
        <ul className="list">
          {routes.map(function(route, index) {
            return (
              <div key={index}>
                <Link to={link.concat(route.id)}>
                  <li className="homeRouteItem">
                    <Row>
                      <h5 className={"homeRouteText" + index}>
                        <b>{route.name}</b>
                      </h5>
                    </Row>
                    <Row>{this.showImages(route)}</Row>
                    <Row>
                      <p className={"homeRouteText" + index}>
                        <b>
                          By {route.pilot.name} {route.pilot.surname1}
                        </b>
                      </p>
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

  render() {
    if (this.state.routes) {
      let routesArr = this.state.routes;
      let routes = [routesArr[0], routesArr[1], routesArr[2]];
      return (
        <div>
          <Row className="homeRow">
            <h1 className="homeTitle">
              <b>Welcome to WikiFlight</b>
            </h1>
            <h5 className="homeTitle">
              Please{" "}
              <Link className="profileLink" to={"/login"}>
                <b> sign in</b>
              </Link>{" "}
              or{" "}
              <Link className="profileLink" to={"/register"}>
                <b> register</b>
              </Link>{" "}
              for the full experience of our features
            </h5>
          </Row>
          <Row>
            {/* Last routes published list */}
            <Col className="col-sm-5">
              <h5 className="homeListTitle">
                {" "}
                <b>Last routes published</b>
              </h5>
              {this.renderRouteList()}
            </Col>

            {/* Map of last routes published list */}
            <Col>
              <MapHome routes={routes}></MapHome>
            </Col>
          </Row>
        </div>
      );
    } else
      return (
        <div>
          <Row className="homeRow">
            <h1 className="homeTitle">
              <b>Welcome to WikiFlight</b>
            </h1>
            <h5 className="homeTitle">
              Please{" "}
              <Link className="profileLink" to={"/login"}>
                <b> sign in</b>
              </Link>{" "}
              or{" "}
              <Link className="profileLink" to={"/register"}>
                <b> register</b>
              </Link>{" "}
              for the full experience of our features
            </h5>
          </Row>
          <Row>
            <div className="loader">
              <Loader
                as="span"
                type="Plane"
                color="#6b6630"
                height={20}
                width={20}
              />
            </div>
          </Row>
        </div>
      );
  }
}

export default HomeAnonymous;
