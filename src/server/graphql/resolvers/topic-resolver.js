const topic = require("server-common/kafka/topic");

const topicsResolver = async (
  _parent,
  { topicName },
  { kafkaConnectionConfig }
) => {
  return await topic(topicName, kafkaConnectionConfig);
};

module.exports = topicsResolver;
