const resolvers = {
  Query: {
    cluster: require("./resolvers/cluster-resolver")
  },
  Cluster: {
    topic: require("./resolvers/topic-resolver"),
    topics: require("./resolvers/topics-resolver")
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
