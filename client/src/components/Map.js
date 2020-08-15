import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import MapGL, { NavigationControl } from "@urbica/react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
// import ReactMapGl, { NavigationControl } from "react-map-gl";
// import Button from "@material-ui/core/Button";
// import Typography from "@material-ui/core/Typography";
// import DeleteIcon from "@material-ui/icons/DeleteTwoTone";

const MAP_API_KEY = process.env.REACT_APP_MAP_API_KEY;

const Map = ({ classes }) => {
  const [viewport, setViewport] = useState({
    latitude: 6.232380124359144,
    longitude: -75.57307319431575,
    zoom: 12,
  });

  return (
    <div className={classes.root}>
      <MapGL
        style={{ width: "100vw", height: "calc(100vh - 64px)" }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        accessToken={MAP_API_KEY}
        latitude={viewport.latitude}
        longitude={viewport.longitude}
        zoom={viewport.zoom}
        onViewportChange={setViewport}
      >
        <div className={classes.navigationControl}>
          <NavigationControl showCompass showZoom position="top-right" />
        </div>
      </MapGL>
    </div>
  );
};

const styles = {
  root: {
    display: "flex",
  },
  rootMobile: {
    display: "flex",
    flexDirection: "column-reverse",
  },
  navigationControl: {
    position: "absolute",
    top: 0,
    left: 0,
    margin: "1em",
  },
  deleteIcon: {
    color: "red",
  },
  popupImage: {
    padding: "0.4em",
    height: 200,
    width: 200,
    objectFit: "cover",
  },
  popupTab: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
};

export default withStyles(styles)(Map);
