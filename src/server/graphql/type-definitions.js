const { gql } = require("apollo-server");

const typeDefs = gql`
  type PartitionMetadata {
    leader: Int!
    replicas: [Int!]!
    inSyncReplicas: [Int!]!
  }

  type Partition {
    partitionNumber: Int!
    metadata: PartitionMetadata!
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
