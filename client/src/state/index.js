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
} from "./types";

export const Context = createContext({
  currentUser: null,
  isAuth: false,
  draft: null,
  pins: [],
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

    default:
      return state;
  }
};
