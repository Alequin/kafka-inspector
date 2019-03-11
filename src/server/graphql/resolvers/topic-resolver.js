const topicWithCache = require("server-common/kafka/topic-with-cache");

const topicsResolver = async (
  _parent,
  { topicName },
  { kafkaConnectionConfig }
) => {
  return await topicWithCache(topicName, kafkaConnectionConfig);
};

module.exports = topicsResolver;
