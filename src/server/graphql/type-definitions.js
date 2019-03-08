const { gql } = require("apollo-server");

const typeDefs = gql`
  type Partition {
    partitionNumber: Int!
    leader: Int!
    replicas: [Int!]!
    inSyncReplicas: [Int!]!
  }

  type Topic {
    name: String!
    partitions(partitionNumbers: [Int!]): [Partition!]!
  }

  type Query {
    topics: [Topic!]!
  }
`;

module.exports = typeDefs;
