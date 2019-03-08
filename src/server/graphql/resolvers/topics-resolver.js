const listTopicsWithCache = require("server-common/kafka/list-topics-with-cache");

const topicsResolver = async () => {
  return await listTopicsWithCache();
};

module.exports = topicsResolver;
