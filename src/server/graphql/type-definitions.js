const { gql } = require("apollo-server");

const typeDefs = gql`
  type Partition {
    partitionNumber: Int!
    leader: Int!
    replicas: [Int!]!
    inSyncReplicas: [Int!]!
  }

  type Config {
    name: String!
    value: String
    readOnly: Boolean!
    isDefault: Boolean!
    isSensitive: Boolean!
  }

  type ConfigList {
    name: String!
    value: String
    readOnly: Boolean!
    isDefault: Boolean!
    isSensitive: Boolean!
  }

  type Topic {
    name: String!
    partitions(partitionNumbers: [Int!]): [Partition!]!
    config: [Config!]!
  }

  type Query {
    topic(topicName: String!): Topic!
    topics: [Topic!]!
  }
`;

module.exports = typeDefs;
