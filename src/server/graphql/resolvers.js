const resolvers = {
  Query: {
    topics: require("./resolvers/topics-resolver")
  },
  Topic: {
    partitions: require("./resolvers/partitions-resolver")
  }
};

module.exports = resolvers;
