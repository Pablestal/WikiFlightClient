import React from "react";
import L from "leaflet";

//NEEDED PROPS: initialPosition, zoom

class MapEdit extends React.Component {
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

    this.map = L.map("mapid", {
      maxZoom: 14
    }).setView(this.props.initialPosition, this.props.zoom);

    const handleClick = e => {
      this.props.handleClick(e);
    };

    this.map.on("click", handleClick);

    this.tileLayer = L.tileLayer(
      "https://maps.heigit.org/openmapsurfer/tiles/roads/webmercator/{z}/{x}/{y}.png",
      {
        attribution:
          'Imagery from <a href="http://giscience.uni-hd.de/">University of Heidelberg</a> | Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }
    ).addTo(this.map);

    this.marker = L.marker(this.props.initialPosition, {
      icon: airportIcon
    }).addTo(this.map);
  }

  componentDidUpdate(prevProps) {
    if (this.props.initialPosition !== prevProps.user) {
      this.marker.setLatLng(this.props.initialPosition);
      this.map.setView(this.props.initialPosition);
    }
  }

  render() {
    return <div id="mapid"></div>;
  }
}

export default MapEdit;
