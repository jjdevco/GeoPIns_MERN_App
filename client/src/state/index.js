import { createContext } from "react";
import { LOGIN_USER, SIGNOUT_USER, IS_AUTH } from "./types";

export const Context = createContext({
  currentUser: null,
  isAuth: false,
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

    default:
      return state;
  }
};
