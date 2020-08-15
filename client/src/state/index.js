import { createContext } from "react";
import {
  LOGIN_USER,
  SIGNOUT_USER,
  IS_AUTH,
  CREATE_DRAFT,
  UPDATE_DRAFT_LOCATION,
  CLEAR_DRAFT,
} from "./types";

export const Context = createContext({
  currentUser: null,
  isAuth: false,
  draft: null,
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

    default:
      return state;
  }
};
