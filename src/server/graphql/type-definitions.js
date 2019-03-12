const { gql } = require("apollo-server");

const typeDefs = gql`
  type memberAssignment {
    topicName: String!
    partitionNumbers: [Int!]!
  }

  type memberMetadata {
    subscription: [String!]!
    version: Int!
    userData: String
    id: String!
  }

  type consumerGroupMember {
    memberId: String!
    clientId: String!
    clientHost: String!
    memberMetadata: memberMetadata!
    memberAssignment: [memberAssignment]!
  }

  type ConsumerGroup {
    members: [consumerGroupMember!]!
    state: String!
    protocolType: String!
    protocol: String!
    brokerId: String!
  }

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

  type Topic {
    name: String!
    partitions(partitionNumbers: [Int!]): [Partition!]!
    config: [Config!]!
  }

  type Cluster {
    topic(topicName: String!): Topic!
    topics: [Topic!]!
    consumerGroup(groupName: String!): ConsumerGroup!
  }

  type Query {
    cluster(kafkaBrokers: [String!]): Cluster
  }
`;

module.exports = typeDefs;
