const topic = require("server-common/kafka/topic");

const topicsResolver = async (_parent, { topicName }) => {
  return await topic(topicName);
};

module.exports = topicsResolver;
