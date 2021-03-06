import React, { Component } from "react";
import { connect } from "react-redux";
import { notify } from "react-notify-toast";
import { HTTP } from "../../../../common/http-common";
import { Image, Row, Col } from "react-bootstrap";
import Loader from "react-loader-spinner";
import { Link } from "react-router-dom";
import {
  initializeRouteAction,
  deleteRouteAction
} from "../../../../redux/actions";

class RouteListFavourite extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    HTTP.get(`users/${this.props.login}`)
      .then(res => {
        const favRoutes = res.data.favRoutes;
        let routes = [];

        favRoutes.map(r => {
          if (r.isPublic || r.pilot.login === this.props.login) {
            routes.push(r);
            return null;
          } else return null;
        });

        console.log(routes);
        routes.sort(function(a, b) {
          return b.id - a.id;
        });
        this.setState({ routes });
      })
      .catch(function(error) {
        notify.show("Error loading pilot routes", "error");
      });
  }

  showAvatar(route) {
    let showedAvatar;
    let minID;

    route.images.length > 0
      ? (minID = route.images.reduce(
          (min, p) => (p.id < min ? p.id : min),
          route.images[0].id
        ))
      : (minID = 0);

    showedAvatar = (
      <Image
        className="routeListImage"
        onError={e => {
          e.target.onerror = null;
          e.target.src = "/images/defaultPic.jpg";
        }}
        src={
          "http://localhost:8080/api/users/image/route" +
          route.id +
          "Image" +
          minID +
          ".jpg"
        }
        alt={route.id + "routeImage"}
        fluid
      />
    );
    return showedAvatar;
  }

  render() {
    let routes = this.state.routes;
    let link = "/routes/detail/";
    if (routes) {
      if (routes.length === 0) {
        return (
          <h3 className="routeListEmpty tittle">
            List is empty, add a route to your favourite route list.{" "}
          </h3>
        );
      } else {
        return (
          <div>
            <ul className="list">
              {routes.map(function(route, index) {
                return (
                  <div key={index}>
                    <Link to={link.concat(route.id)}>
                      <li className="routeListItem">
                        <Row className="routeListRow">
                          <Col className="routeListImgCol col-sm-2">
                            {this.showAvatar(route)}
                          </Col>
                          <Col>
                            <h5 className="routeListText">
                              <b>{route.name}</b>
                            </h5>
                            <p className="routeListDescription">
                              {route.description}
                            </p>
                          </Col>

                          <Col xs={3} className="routeListCreatedCol">
                            <p className="routeListText">
                              <b>Created on {route.publicationDay}</b>
                            </p>
                            <p className="routeListText">
                              <b>
                                By {route.pilot.name} {route.pilot.surname1}
                              </b>
                            </p>
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
})(RouteListFavourite);
