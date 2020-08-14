import React, { useContext } from "react";
import { GraphQLClient } from "graphql-request";
import { GoogleLogin } from "react-google-login";
import { withStyles } from "@material-ui/core/styles";

import { Context } from "../../state";
import { LOGIN_USER } from "../../state/types";

import { ME_QUERY } from "../../graphql/queries";

import Typography from "@material-ui/core/Typography";

const clientId = process.env.REACT_APP_AUTH_CLIENT_ID;

const Login = ({ classes }) => {
  const { dispatch } = useContext(Context);

  const onSuccess = async (googleUser) => {
    try {
      const idToken = googleUser.getAuthResponse().id_token;

      const client = new GraphQLClient(process.env.REACT_APP_API_HOST, {
        headers: { authorization: idToken },
      });

      const { me } = await client.request(ME_QUERY);
      dispatch({ type: LOGIN_USER, payload: me });
    } catch (err) {
      onFailure(err);
    }
  };

  const onFailure = (err) => {
    console.error(err);
  };

  return (
    <div className={classes.root}>
      <Typography
        style={{ color: "rgb(66,133,244)" }}
        component="h1"
        variant="h3"
        gutterBottom
        noWrap
      >
        Welcome
      </Typography>

      <GoogleLogin
        clientId={clientId}
        onSuccess={onSuccess}
        onFailure={onFailure}
        isSignedIn={true}
        theme="dark"
      />
    </div>
  );
};

const styles = {
  root: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
};

export default withStyles(styles)(Login);
