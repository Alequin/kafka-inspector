const topic = require("server-common/kafka/topic");

const topicsResolver = async (_parent, { topicName }, context) => {
  return await topic(topicName);
};

module.exports = topicsResolver;
