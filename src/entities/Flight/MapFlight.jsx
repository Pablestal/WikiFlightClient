import React from "react";
import L from "leaflet";
//NEEDED PROPS: initialPosition, zoom

class MapNew extends React.Component {
  componentDidMount() {
    let airportIcon = new L.Icon({
      iconUrl: require("../../icons/airport.svg"),
      iconRetinaUrl: require("../../icons/airport.svg"),
      iconAnchor: [23, 44],
      iconSize: [45, 45],
      shadowUrl: "../assets/marker-shadow.png",
      shadowSize: [68, 95],
      shadowAnchor: [20, 92]
    });

    if (!this.props.bounds) {
      this.map = L.map("mapid").setView(
        this.props.initialPosition,
        this.props.zoom
      );
      this.marker = L.marker(this.props.initialPosition, {
        icon: airportIcon
      }).addTo(this.map);

      this.circle = L.circle(this.props.initialPosition, 12000, {
        dashArray: 4,
        color: "#a14655"
      }).addTo(this.map);
    } else {
      this.map = L.map("mapid").fitBounds(this.props.bounds);
      this.marker1 = L.marker(this.props.marker1, {
        icon: airportIcon
      }).addTo(this.map);

      this.marker2 = L.marker(this.props.marker2, {
        icon: airportIcon
      }).addTo(this.map);

      //   this.polyline = L.polyline(this.props.polyline, {
      //     dashArray: 4,
      //     color: "#a14655"
      //   }).addTo(this.map);
      L.bezier({
        path: this.props.polyline,

        icon: {
          path: "plane.png"
        }
      }).addTo(this.map);
    }

    this.tileLayer = L.tileLayer(
      "https://maps.heigit.org/openmapsurfer/tiles/roads/webmercator/{z}/{x}/{y}.png",
      {
        attribution:
          'Imagery from <a href="http://giscience.uni-hd.de/">University of Heidelberg</a> | Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }
    ).addTo(this.map);
  }

  render() {
    return <div id="mapid"></div>;
  }
}

export default MapNew;
