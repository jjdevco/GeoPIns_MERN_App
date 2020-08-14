import { createContext } from "react";
import { LOGIN_USER } from "./types";

export const Context = createContext({
  currentUser: null,
});

export const Reducer = (state, { type, payload }) => {
  switch (type) {
    case LOGIN_USER:
      return {
        ...state,
        currentUser: payload,
      };
    default:
      return state;
  }
};
