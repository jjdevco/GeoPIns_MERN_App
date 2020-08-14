import React, { useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import { GoogleLogout } from "react-google-login";

import { Context } from "../../state";

import { SIGNOUT_USER } from "../../state/types";

import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Typography from "@material-ui/core/Typography";

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
          <Typography className={classes.buttonText} variant="body1">
            Sign Out
          </Typography>
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
    color: "orange",
  },
  buttonIcon: {
    marginLeft: "5px",
    color: "orange",
  },
};

export default withStyles(styles)(Signout);
