const { ApolloServer } = require("apollo-server-express");
const { makeExecutableSchema } = require("graphql-tools");
const resolvers = require("./resolvers");
const typeDefinitions = require("./type-definitions");

const GRAPHQL_ENDPOINT = "/graphql";

const schema = makeExecutableSchema({
  typeDefs: typeDefinitions,
  resolvers
});

const setupGraphql = expressServer => {
  const apolloServer = new ApolloServer({
    schema,
    uploads: false
  });

  apolloServer.applyMiddleware({
    app: expressServer,
    path: GRAPHQL_ENDPOINT
  });
};

module.exports = setupGraphql;
