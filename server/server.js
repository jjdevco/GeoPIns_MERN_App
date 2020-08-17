const env = require("dotenv").config();
const path = require("path");
const express = require("express");
const { ApolloServer, makeExecutableSchema } = require("apollo-server-express");
const { createServer } = require("http");
const { execute, subscribe } = require("graphql");
const { PubSub } = require("graphql-subscriptions");
const { SubscriptionServer } = require("subscriptions-transport-ws");

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

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Apply Express Middlewares to Apollo
const apolloServer = new ApolloServer({
  schema,
  context: ({ req }) => {
    const user = req.user;
    return { user: user ? user : null };
  },
});
apolloServer.applyMiddleware({ app });

const pubsub = new PubSub();
const server = createServer(app);

// Listen server
const port = process.env.PORT || 5000;

initConnection(() => {
  server.listen(port, () => {
    console.log(`Server listening on ${port}`);
    new SubscriptionServer(
      {
        execute,
        subscribe,
        schema,
      },
      {
        server: server,
        path: "/subscriptions",
      }
    );
  });
});
