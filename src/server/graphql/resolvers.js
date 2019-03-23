const resolvers = {
  Subscription: {
    latestOffsetConsumer: {
      subscribe: require("./resolvers/latest-offset-consumer-resolver")
    }
  },
  Query: {
    cluster: require("./resolvers/cluster-resolver")
  },
  Cluster: {
    topic: require("./resolvers/topic-resolver"),
    topics: require("./resolvers/topics-resolver"),
    queryConsumer: require("./resolvers/consumer-resolver"),
    consumerGroup: require("./resolvers/consumer-group-resolver"),
    consumerGroups: require("./resolvers/consumer-groups-resolver")
  },
  Topic: {
    partitions: require("./resolvers/partitions-resolver"),
    config: require("./resolvers/topic-config-resolver")
  },
  Partition: {
    latestOffset: require("./resolvers/latest-offsets-resolver")
  }
};

module.exports = resolvers;
