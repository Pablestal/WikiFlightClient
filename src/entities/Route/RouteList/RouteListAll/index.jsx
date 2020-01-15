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

class RouteListAll extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    HTTP.get(`routes`)
      .then(res => {
        const routes = res.data;
        routes.sort(function(a, b) {
          return b.id - a.id;
        });
        this.setState({ routes });
      })
      .catch(function(error) {
        notify.show("Error loading public routes", "error");
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

  showComments(route) {
    if (this.props.authenticated && this.props.authority === "ADMIN") {
      if (route.comments.length > 0)
        return (
          <p className="routeListAdminComments">
            <b>Comments: {route.comments.length}</b>
          </p>
        );
    }
  }

  render() {
    let routesArr = this.state.routes;
    let link = "/routes/detail/";

    if (routesArr) {
      if (routesArr.length === 0) {
        return (
          <h3 className="routeListEmpty">List is empty, create a new route.</h3>
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
                      <li className="routeListItem">
                        <Row className="routeListRow">
                          <Col className="routeListImgCol col-sm-2">
                            {this.showAvatar(route)}
                          </Col>
                          <Col>
                            <h5 className="routeListText">
                              <b>{route.name}</b>
                            </h5>
                            <p className="routeListText">{route.description}</p>
                          </Col>

                          <Col>
                            <p className="routeListText">
                              <b>Created on {route.publicationDay}</b>
                            </p>
                            <p className="routeListText">
                              <b>
                                By {route.pilot.name} {route.pilot.surname1}
                              </b>
                            </p>
                            {this.showComments(route)}
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
})(RouteListAll);
