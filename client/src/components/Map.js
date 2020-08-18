import React, { useState, useEffect, useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";
import MapGL, { NavigationControl, Marker, Popup } from "@urbica/react-map-gl";
import diferrenceInMinutes from "date-fns/difference_in_minutes";

import { Subscription } from "react-apollo";

import GraphqlClient from "../graphql/client";
import { GET_PINS_QUERY } from "../graphql/queries";
import { DELETE_PIN_MUTATION } from "../graphql/mutations";
import {
  PIN_ADDED_SUBSCRIPTION,
  PIN_UPDATED_SUBSCRIPTION,
  PIN_REMOVED_SUBSCRIPTION,
} from "../graphql/subscriptions";

import { Context } from "../state";
import {
  CREATE_DRAFT,
  UPDATE_DRAFT_LOCATION,
  UPDATE_PINS,
  CREATE_PIN,
  SET_PIN,
  UPDATE_PIN,
  DELETE_PIN,
} from "../state/types";

import Blog from "./Blog";
import PinIcon from "./PinIcon";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/DeleteTwoTone";

const MAP_API_KEY = process.env.REACT_APP_MAP_API_KEY;

const Map = ({ classes }) => {
  const mobileSize = useMediaQuery("(max-width: 800px)");
  const {
    state: { draft, pins, currentUser },
    dispatch,
  } = useContext(Context);

  const [viewport, setViewport] = useState({
    latitude: 6.232380124359144,
    longitude: -75.57307319431575,
    zoom: 12,
  });

  const [userPosition, setUserPosition] = useState(null);

  const [popup, setPopup] = useState(null);
  const isAuthUser = () => currentUser._id === popup.author._id;

  const getUserPosition = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setViewport((viewport) => ({ ...viewport, latitude, longitude }));
        setUserPosition({ latitude, longitude });
      });
    }
  };

  const getPins = async () => {
    const client = GraphqlClient();
    const { getPins } = await client.request(GET_PINS_QUERY);
    dispatch({ type: UPDATE_PINS, payload: getPins });
  };

  const onDragEnd = (lngLat) => {
    dispatch({
      type: UPDATE_DRAFT_LOCATION,
      payload: { longitude: lngLat.lng, latitude: lngLat.lat },
    });
  };

  const handleSelectPin = async (pin) => {
    setPopup(pin);
    await dispatch({ type: SET_PIN, payload: pin });
  };

  const handleMapClick = ({ lngLat }) => {
    setPopup(null);

    if (!draft) {
      dispatch({ type: CREATE_DRAFT });
    }

    dispatch({
      type: UPDATE_DRAFT_LOCATION,
      payload: { latitude: lngLat.lat, longitude: lngLat.lng },
    });
  };

  const handleDeletePin = async (pin) => {
    const client = GraphqlClient();
    const variables = { pinId: pin._id };
    await client.request(DELETE_PIN_MUTATION, variables);
    setPopup(null);
  };

  const highlightNewPin = (pin) =>
    diferrenceInMinutes(Date.now(), Number(pin.createdAt)) <= 30
      ? "limegreen"
      : "darkblue";

  useEffect(() => {
    getUserPosition();
  }, []);

  useEffect(() => {
    getPins();
  }, []);

  return (
    <div className={mobileSize ? classes.rootMobile : classes.root}>
      <h1>{userPosition}</h1>
      <MapGL
        style={{ width: "100vw", height: "calc(100vh - 64px)" }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        accessToken={MAP_API_KEY}
        scrollZoom={!mobileSize}
        {...viewport}
        onViewportChange={setViewport}
        onClick={handleMapClick}
      >
        <div className={classes.navigationControl}>
          <NavigationControl showCompass showFade position="top-right" />
        </div>

        {/* Pin for User's current Position */}
        {userPosition && (
          <Marker
            latitude={viewport.latitude}
            longitude={viewport.longitude}
            offsetLeft={19}
            offsetTop={-37}
          >
            <PinIcon size={40} color="hotpink" />
          </Marker>
        )}

        {/* Draft Pin */}
        {draft && (
          <Marker
            latitude={draft.latitude}
            longitude={draft.longitude}
            offsetLeft={19}
            offsetTop={-37}
            onDragEnd={onDragEnd}
            draggable
          >
            <PinIcon size={40} color="red " />
          </Marker>
        )}

        {/* Saved Pins */}
        {pins.map((pin) => (
          <Marker
            key={pin._id}
            latitude={pin.latitude}
            longitude={pin.longitude}
            offsetLeft={19}
            offsetTop={-37}
          >
            <PinIcon
              size={40}
              color={highlightNewPin(pin)}
              onClick={() => handleSelectPin(pin)}
            />
          </Marker>
        ))}

        {/*  Popup Dialog for Created Pins */}

        {popup && (
          <Popup
            anchor="top"
            latitude={popup.latitude}
            longitude={popup.longitude}
            closeOnClick={false}
            onClose={() => handleSelectPin(null)}
          >
            <img
              className={classes.popupImage}
              src={popup.image}
              alt={popup.title}
            />
            <div className={classes.popupTab}>
              <Typography>
                {popup.latitude.toFixed(6)}, {popup.longitude.toFixed(6)}
              </Typography>
              {isAuthUser() && (
                <Button
                  className={classes.deleteIcon}
                  onClick={() => handleDeletePin(popup)}
                >
                  <DeleteIcon />
                </Button>
              )}
            </div>
          </Popup>
        )}
      </MapGL>

      {/* Subscriptions for Creating / Updating / Deleting Pins */}
      <Subscription
        subscription={PIN_ADDED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinAdded } = subscriptionData.data;
          dispatch({ type: CREATE_PIN, payload: pinAdded });
        }}
      />

      <Subscription
        subscription={PIN_UPDATED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinUpdated } = subscriptionData.data;
          dispatch({ type: UPDATE_PIN, payload: pinUpdated });
        }}
      />

      <Subscription
        subscription={PIN_REMOVED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinRemoved } = subscriptionData.data;
          dispatch({ type: DELETE_PIN, payload: pinRemoved });
        }}
      />

      {/* Blog area */}
      <Blog />
    </div>
  );
};

const styles = (theme) => ({
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
});

export default withStyles(styles)(Map);
