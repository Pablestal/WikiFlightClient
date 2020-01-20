import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./HomeAdmin.css";

class HomeAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <Row className="homeAdminRow">
          <h1 className="homeAdminTitle">
            <b>Admin page of WikiFlight</b>
          </h1>
        </Row>
        <Row className="homeAdminCardsRow">
          <Col className="cardContainer">
            <Link
              to={{
                pathname: `/aircrafts`
              }}
            >
              <img alt="plane" className="cardImage" src="/images/avion.jpg" />

              <div className="cardImageOverlay">
                <h1 className="cardImageText">
                  <b>Aircrafts</b>
                </h1>
              </div>
            </Link>
          </Col>

          <Col className="cardContainer">
            <Link
              to={{
                pathname: `/aerodromes`
              }}
            >
              <img
                alt="aerodrome"
                className="cardImage"
                src="/images/aterrizaje.jpg"
              />
              <div className="cardImageOverlay">
                <h1 className="cardImageText">
                  <b>Aerodromes</b>
                </h1>
              </div>{" "}
            </Link>
          </Col>
          <Col className="cardContainer">
            <Link
              to={{
                pathname: `/routes`
              }}
            >
              <img alt="route" className="cardImage" src="/images/route.jpg" />
              <div className="cardImageOverlay">
                <h1 className="cardImageText">
                  <b>Routes</b>
                </h1>
              </div>
            </Link>
          </Col>
        </Row>
      </div>
    );
  }
}

export default HomeAdmin;
