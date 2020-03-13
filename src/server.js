const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const http = require("http");

require("./config/db");
const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");

const app = express();
const port = 5000;

const schema = new ApolloServer({
  typeDefs,
  resolvers
});

schema.applyMiddleware({ app, path: "/graphql" });

// Wrap the Express server, Server setup for websockets to use graphql subscriptions
const graphQLServer = http.createServer(app);
schema.installSubscriptionHandlers(graphQLServer);

graphQLServer.listen(port, () => {
  console.log(`Server is Listening on Port ${port}`);
  console.log(
    `Subscriptions ready at ws://localhost:${port}${schema.subscriptionsPath}`
  );
});
