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
    latestOffset: Int!
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

  type Cluster {
    topic(topicName: String!): Topic!
    topics: [Topic!]!
  }

  type Query {
    cluster(kafkaBrokers: String!): Cluster
  }
`;

module.exports = typeDefs;
