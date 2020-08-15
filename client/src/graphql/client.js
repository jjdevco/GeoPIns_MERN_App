import { GraphQLClient } from "graphql-request";

const GrahpqlClient = (idToken) =>
  new GraphQLClient(process.env.REACT_APP_API_HOST, {
    headers: {
      authorization: idToken
        ? idToken
        : window.gapi.auth2
            .getAuthInstance()
            .currentUser.get()
            .getAuthResponse().id_token,
    },
  });

export default GrahpqlClient;
