const { gql } = require("apollo-server-express");

module.exports = gql`
  type User {
    _id: ID
    name: String
    email: String
    picture: String
  }

  type Query {
    me: User
  }
`;
