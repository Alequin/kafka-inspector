module.exports = `
  type Cluster {
    brokers: [Broker!]!
    topic(topicName: String!): Topic!
    topics: [Topic!]!
    consumerGroup(groupName: String!): ConsumerGroup!
    consumerGroups: [ConsumerGroup!]!
  }
`;
