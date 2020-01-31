import React from "react";
import L from "leaflet";

//NEEDED PROPS: (initialPosition, zoom)
class MapImage extends React.Component {
  componentDidMount() {
    this.map = L.map("mapid", {
      maxZoom: 14
    }).setView(this.props.initialPosition, this.props.zoom);

    this.tileLayer = L.tileLayer(
      "https://maps.heigit.org/openmapsurfer/tiles/roads/webmercator/{z}/{x}/{y}.png",
      {
        attribution:
          'Imagery from <a href="http://giscience.uni-hd.de/">University of Heidelberg</a> | Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }
    ).addTo(this.map);

    const handleClick = e => {
      this.props.handleClick(e);
      this.marker.addTo(this.map);
    };

    this.map.on("click", handleClick);

    this.marker = L.marker(this.props.initialPosition);
  }

  componentDidUpdate(prevProps) {
    if (this.props.initialPosition !== prevProps.initialPosition) {
      this.marker.setLatLng(this.props.initialPosition);
      this.map.setView(this.props.initialPosition);
    }
    if (this.props.selectedCoord !== prevProps.selectedCoord) {
      this.marker.addTo(this.map);
    }
    this.map.invalidateSize();
  }

  render() {
    return <div id="mapid"></div>;
  }
}

export default MapImage;
