import { createContext } from "react";
import { LOGIN_USER, IS_AUTH } from "./types";

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

    case IS_AUTH: {
      return { ...state, isAuth: payload };
    }

    default:
      return state;
  }
};
