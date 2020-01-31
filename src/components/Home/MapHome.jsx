import React from "react";
import L from "leaflet";

class MapHome extends React.Component {
  componentDidMount() {
    let airportIcon = new L.Icon({
      iconUrl: require("../../icons/airport.svg"),
      iconRetinaUrl: require("../../icons/airport.svg"),
      iconAnchor: [16, 28],
      iconSize: [30, 30],
      shadowUrl: "../assets/marker-shadow.png",
      shadowSize: [68, 95],
      shadowAnchor: [20, 92]
    });

    let endIcon = new L.Icon({
      iconUrl: require("../../icons/end.svg"),
      iconRetinaUrl: require("../../icons/end.svg"),
      iconAnchor: [1, 25],
      iconSize: [25, 25],
      shadowUrl: "../assets/marker-shadow.png",
      shadowSize: [68, 95],
      shadowAnchor: [20, 92]
    });

    /// PATHS POLYLINES ///
    let path1 = this.props.routes[0].path.coordinates;
    let path2 = this.props.routes[1].path.coordinates;
    let path3 = this.props.routes[2].path.coordinates;

    this.map = L.map("mapid", {
      maxZoom: 14
    });

    this.pathLine1 = L.polyline(path1, {
      color: "#a14655",
      weight: 4,
      lineCap: "square",
      stroke: true
    }).bindTooltip(this.props.routes[0].name, { sticky: true });

    this.pathLine2 = L.polyline(path2, {
      color: "#24310b",
      weight: 4
    }).bindTooltip(this.props.routes[1].name, { sticky: true });

    this.pathLine3 = L.polyline(path3, {
      color: "#120b31",
      weight: 4
    }).bindTooltip(this.props.routes[2].name, { sticky: true });

    this.featureGroup = L.featureGroup([
      this.pathLine1,
      this.pathLine2,
      this.pathLine3
    ]);

    this.bounds = this.featureGroup.getBounds();

    this.map.fitBounds(this.bounds);

    /// DEPARTURE MARKERS ///
    this.marker1 = L.marker(path1[0], {
      icon: airportIcon
    })
      .bindTooltip(this.props.routes[0].takeoffAerodrome.name, { sticky: true })
      .addTo(this.map);

    this.marker2 = L.marker(path2[0], {
      icon: airportIcon
    })
      .bindTooltip(this.props.routes[1].takeoffAerodrome.name, { sticky: true })
      .addTo(this.map);

    this.marker3 = L.marker(path3[0], {
      icon: airportIcon
    })
      .bindTooltip(this.props.routes[2].takeoffAerodrome.name, { sticky: true })
      .addTo(this.map);

    /// ARRIVAL MARKERS ///
    this.marker4 = L.marker(path1[path1.length - 1], {
      icon: endIcon
    })
      .bindTooltip(this.props.routes[0].landingAerodrome.name, { sticky: true })
      .addTo(this.map);

    this.marker5 = L.marker(path2[path2.length - 1], {
      icon: endIcon
    })
      .bindTooltip(this.props.routes[1].landingAerodrome.name, { sticky: true })
      .addTo(this.map);

    this.marker6 = L.marker(path3[path3.length - 1], {
      icon: endIcon
    })
      .bindTooltip(this.props.routes[2].landingAerodrome.name, { sticky: true })
      .addTo(this.map);

    this.featureGroup.addTo(this.map);

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

export default MapHome;
