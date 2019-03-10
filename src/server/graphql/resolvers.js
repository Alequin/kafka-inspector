const resolvers = {
  Query: {
    topic: require("./resolvers/topic-resolver"),
    topics: require("./resolvers/topics-resolver")
  },
  Topic: {
    partitions: require("./resolvers/partitions-resolver")
  }
};

module.exports = resolvers;
