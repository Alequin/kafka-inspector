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
    groupId: String!
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

  enum Comparator {
    EQUAL_TO
    LESS_THAN
    LESS_THAN_OR_EQUAL_TO
    GREATER_THAN
    GREATER_THAN_OR_EQUAL_TO
    REGEXP
  }

  input Condition {
    comparator: Comparator!
    objectPath: String!
    valueToCompare: String!
  }

  enum ENCODING {
    JSON
    AVRO
  }

  type Message {
    topic: String!
    partition: Int!
    offset: Int!
    key: String!
    value: String!
    highWaterOffset: Int!
  }

  type ConditionalConsumerResults {
    matchingMessagesCount: Int!
    rejectedMessagesCount: Int!
    messages: [Message!]!
  }

  type Topic {
    name: String!
    partitions(partitionNumbers: [Int!]): [Partition!]!
    config: [Config!]!
  }

  input ConsumerConditions {
    encoding: ENCODING!
    conditions: [[Condition!]!]!
  }

  type Cluster {
    topic(topicName: String!): Topic!
    topics: [Topic!]!
    conditionalConsumer(
      topicName: String!
      partitions: [Int!]
      minOffset: Int
      maxOffset: Int
      conditions: ConsumerConditions
    ): ConditionalConsumerResults!

    consumerGroup(groupName: String!): ConsumerGroup!
    consumerGroups: [ConsumerGroup!]!
  }

  type Query {
    cluster(kafkaBrokers: [String!]!): Cluster
  }

  type Subscription {
    latestOffsetConsumer(
      kafkaBrokers: [String!]!
      topicName: String!
    ): [Message!]!
  }
`;

module.exports = typeDefs;
