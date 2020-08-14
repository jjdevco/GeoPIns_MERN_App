const env = require("dotenv").config();
const path = require("path");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const cors = require("cors");
const bodyParser = require("body-parser");

const authHandler = require("./middlewares/authHandler");
const errorHandler = require("./middlewares/errorHandler");
const initConnection = require("./helpers/dbInit");

const typeDefs = require("./schema/typeDefs");
const resolvers = require("./schema/resolvers");

const app = express();

// Middlewares Initialization
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Auth Handler Middleware
app.use("/graphql", authHandler);

// Error Handler Middleware
app.use(errorHandler);

// Apply Express Middlewares to Apollo
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const user = req.user;
    return { user: user ? user : null };
  },
});
server.applyMiddleware({ app });

// Listen server
const port = process.env.PORT || 5000;
initConnection(() => {
  app.listen({ port }, () => {
    console.log(`Server listening on ${port}`);
  });
});
