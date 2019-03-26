module.exports = `
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
`;
