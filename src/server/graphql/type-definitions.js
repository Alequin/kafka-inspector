const { gql } = require("apollo-server");

const typeDefs = gql`
  type Query {
    test: Boolean!
  }
`;

module.exports = typeDefs;
