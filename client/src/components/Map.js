import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import MapGL, { NavigationControl, Marker } from "@urbica/react-map-gl";

import PinIcon from "./PinIcon";
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

  const [userPosition, setUserPosition] = useState(null);

  const onDragEnd = (lngLat) => {
    setUserPosition({ longitude: lngLat.lng, latitude: lngLat.lat });
  };

  const getUserPosition = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setViewport((viewport) => ({ ...viewport, latitude, longitude }));
        setUserPosition({ latitude, longitude });
      });
    }
  };

  useEffect(() => {
    getUserPosition();
  }, []);

  return (
    <div className={classes.root}>
      <h1>{userPosition}</h1>
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

        {/* Pin for User's current Position */}
        {userPosition && (
          <Marker
            latitude={viewport.latitude}
            longitude={viewport.longitude}
            offsetLeft={19}
            offsetTop={-37}
            onDragEnd={onDragEnd}
            draggable
          >
            <PinIcon size={40} color="red" />
          </Marker>
        )}
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
