import React, { useContext } from "react";
import { withStyles } from "@material-ui/core/styles";

import { Context } from "../../state";

import { SIGNOUT_USER } from "../../state/types";

import { GoogleLogout } from "react-google-login";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

const Signout = ({ classes }) => {
  const { dispatch } = useContext(Context);

  const onSingOut = () => {
    dispatch({ type: SIGNOUT_USER });
  };

  return (
    <GoogleLogout
      buttonText="Sign Out"
      render={({ onClick }) => (
        <span className={classes.root} onClick={onClick}>
          <ExitToAppIcon className={classes.exitIcon} />
        </span>
      )}
      onLogoutSuccess={onSingOut}
    />
  );
};

const styles = {
  root: {
    cursor: "pointer",
    display: "flex",
  },
  buttonText: {
    color: "white",
  },
  buttonIcon: {
    marginLeft: "5px",
    color: "#e53935",
  },
  exitIcon: {
    color: "#e53935",
    fontSize: "2rem",
  },
};

export default withStyles(styles)(Signout);
