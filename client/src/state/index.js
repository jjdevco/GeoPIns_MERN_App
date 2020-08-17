import { createContext } from "react";

import {
  LOGIN_USER,
  SIGNOUT_USER,
  IS_AUTH,
  CREATE_DRAFT,
  UPDATE_DRAFT_LOCATION,
  CLEAR_DRAFT,
  CREATE_PIN,
  UPDATE_PINS,
  SET_PIN,
  UPDATE_PIN,
  DELETE_PIN,
} from "./types";

export const Context = createContext({
  currentUser: null,
  isAuth: false,
  draft: null,
  pins: [],
  currentPin: null,
});

export const Reducer = (state, { type, payload }) => {
  switch (type) {
    case LOGIN_USER:
      return {
        ...state,
        currentUser: payload,
      };

    case SIGNOUT_USER: {
      return {
        ...state,
        currentUser: null,
        isAuth: false,
      };
    }

    case IS_AUTH: {
      return { ...state, isAuth: payload };
    }

    case CREATE_DRAFT: {
      return {
        ...state,
        draft: {
          latitude: 0,
          longitude: 0,
        },
        currentPin: null,
      };
    }

    case UPDATE_DRAFT_LOCATION: {
      return { ...state, draft: payload };
    }

    case CLEAR_DRAFT: {
      return { ...state, draft: null };
    }

    case CREATE_PIN: {
      const newPin = payload;
      const prevPins = state.pins.filter((pin) => pin._id !== newPin._id);
      return {
        ...state,
        pins: [...prevPins, newPin],
      };
    }

    case UPDATE_PINS: {
      return { ...state, pins: [...state.pins, ...payload] };
    }

    case SET_PIN: {
      return { ...state, currentPin: payload, draft: null };
    }

    case UPDATE_PIN: {
      const updatedPins = [...state.pins].map((pin) =>
        pin._id === payload._id ? { ...payload } : pin
      );
      return { ...state, pins: [...updatedPins], currentPin: payload };
    }

    case DELETE_PIN: {
      const currentPin =
        state.currentPin && state.currentPin._id === payload._id
          ? null
          : state.currentPin;
      const filterPins = [...state.pins].filter(
        (pin) => pin._id !== payload._id
      );
      return { ...state, pins: [...filterPins], currentPin };
    }

    default:
      return state;
  }
};
