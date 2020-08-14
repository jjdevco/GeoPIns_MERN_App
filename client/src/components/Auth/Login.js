import React from "react";
import { GraphQLClient } from "graphql-request";
import { GoogleLogin } from "react-google-login";
import { withStyles } from "@material-ui/core/styles";

// import Typography from "@material-ui/core/Typography";

const clientId = process.env.REACT_APP_AUTH_CLIENT_ID;

const ME_QUERY = `
{
  me {
    _id
    name
    email
    picture
  }
}`;

const Login = ({ classes }) => {
  const onSuccess = async (googleUser) => {
    const idToken = googleUser.getAuthResponse().id_token;

    const client = new GraphQLClient(process.env.REACT_APP_API_HOST, {
      headers: { authorization: idToken },
    });

    const data = await client.request(ME_QUERY);

    console.log(data);
  };

  return (
    <GoogleLogin clientId={clientId} onSuccess={onSuccess} isSignedIn={true} />
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
