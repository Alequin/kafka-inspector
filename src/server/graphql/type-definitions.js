const { gql } = require("apollo-server");
const parsingOptions = require("./enums/parsing-options");
const comparatorOptions = require("./enums/comparator-options");

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
    ${comparatorOptions.EQUAL_TO}
    ${comparatorOptions.NOT_EQUAL_TO}
    ${comparatorOptions.LESS_THAN}
    ${comparatorOptions.LESS_THAN_OR_EQUAL_TO}
    ${comparatorOptions.GREATER_THAN}
    ${comparatorOptions.GREATER_THAN_OR_EQUAL_TO}
    ${comparatorOptions.REGEXP}
  }

  input Condition {
    value: String!
    objectPath: String!
    comparator: Comparator!
  }

  enum Encoding {
    ${parsingOptions.JSON_ENCODING}
    ${parsingOptions.AVRO_ENCODING}
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
    encoding: Encoding!
    conditions: [[Condition!]!]!
  }

  type Broker {
    id: Int!
    host: String!
    isController: Boolean!
  }

  type Cluster {
    brokers: [Broker!]!
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
