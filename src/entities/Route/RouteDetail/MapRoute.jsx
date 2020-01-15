import React from "react";
import L from "leaflet";

class MapRoute extends React.Component {
  componentDidMount() {
    this.map = L.map("mapid").fitBounds(this.props.bounds);

    let airportIcon = new L.Icon({
      iconUrl: require("../../../icons/airport.svg"),
      iconRetinaUrl: require("../../../icons/airport.svg"),
      iconAnchor: [23, 43],
      iconSize: [45, 45],
      shadowUrl: "../assets/marker-shadow.png",
      shadowSize: [68, 95],
      shadowAnchor: [20, 92]
    });

    let endIcon = new L.Icon({
      iconUrl: require("../../../icons/end.svg"),
      iconRetinaUrl: require("../../../icons/end.svg"),
      iconAnchor: [3, 33],
      iconSize: [35, 35],
      shadowUrl: "../assets/marker-shadow.png",
      shadowSize: [68, 95],
      shadowAnchor: [20, 92]
    });

    let cameraIcon = new L.Icon({
      iconUrl: require("../../../icons/camera.svg"),
      iconRetinaUrl: require("../../../icons/camera.svg"),
      iconAnchor: [10, 5],
      iconSize: [20, 20],
      shadowUrl: "../assets/marker-shadow.png",
      shadowSize: [68, 95],
      shadowAnchor: [20, 92]
    });

    this.props.images.map((image, index) => {
      let popup = L.popup();

      let marker = L.marker(image.position.coordinates, {
        icon: cameraIcon,
        title: image.name,
        riseOnHover: true
      })
        .bindPopup(
          popup.setContent(
            "<center><h5><b>" +
              image.name +
              "</b></h5></center>" +
              "<img src='" +
              this.props.imagePaths[index] +
              "'height=200px width=250px</img>"
          )
        )
        .addTo(this.map);

      return marker;
    });

    this.marker1 = L.marker(this.props.marker1, {
      icon: airportIcon
    })
      .bindPopup(
        L.popup().setContent(
          "<center><p><b>" + this.props.departure.name + "</b></p></center>"
        )
      )
      .addTo(this.map);

    this.marker2 = L.marker(this.props.marker2, {
      icon: endIcon
    })
      .bindPopup(
        L.popup().setContent(
          "<center><p><b>" + this.props.arrival.name + "</b></p></center>"
        )
      )
      .addTo(this.map);

    this.pathLine = L.polyline(this.props.polyline, { color: "#a14655" }).addTo(
      this.map
    );

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

export default MapRoute;
