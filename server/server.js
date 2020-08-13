const env = require("dotenv").config();
const path = require("path");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const cors = require("cors");
const bodyParser = require("body-parser");
const errorHandler = require("./middlewares/errorHandler");
const initConnection = require("./helpers/dbInit");

const typeDefs = require("./schema/typeDefs");
const resolvers = require("./schema/resolvers");

const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Middlewares Initialization
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Error Handler Middleware
app.use(errorHandler);

// Apply Express Middlewares to Apollo
server.applyMiddleware({ app });

// Listen PORT
const port = process.env.PORT || 5000;

initConnection(() => {
  app.listen({ port }, () => {
    console.log(`Server listening on ${port}`);
  });
});
