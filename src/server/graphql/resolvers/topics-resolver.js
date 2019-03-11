const listTopicsWithCache = require("server-common/kafka/list-topics-with-cache");

const topicsResolver = async (_parent, _args, { kafkaConnectionConfig }) => {
  return await listTopicsWithCache(kafkaConnectionConfig);
};

module.exports = topicsResolver;
