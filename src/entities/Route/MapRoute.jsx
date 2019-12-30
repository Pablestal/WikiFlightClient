import React from "react";
import L from "leaflet";

//NEEDED PROPS: (initialPosition, zoom)
class MapRoute extends React.Component {
  componentDidMount() {
    this.map = L.map("mapid").setView(
      this.props.initialPosition,
      this.props.zoom
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
