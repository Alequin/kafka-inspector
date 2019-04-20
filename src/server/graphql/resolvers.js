const resolvers = {
  Subscription: {
    latestOffsetConsumer: {
      subscribe: require("./resolvers/latest-offset-consumer-resolver")
    }
  },
  Mutation: {
    addCluster: require("./resolvers/add-cluster-resolver"),
    deleteCluster: require("./resolvers/delete-cluster-resolver")
  },
  Query: {
    storedClusters: require("./resolvers/stored-clusters-resolver"),
    cluster: require("./resolvers/cluster-resolver"),
    conditionalConsumer: require("./resolvers/conditional-consumer-resolver")
  },
  Cluster: {
    brokers: require("./resolvers/brokers-resolver"),
    topic: require("./resolvers/topic-resolver"),
    topics: require("./resolvers/topics-resolver"),
    consumerGroup: require("./resolvers/consumer-group-resolver"),
    consumerGroups: require("./resolvers/consumer-groups-resolver"),
    offsets: require("./resolvers/offsets-resolver")
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
