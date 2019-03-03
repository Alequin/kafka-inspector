const { prepareQuery } = require("../sqlite-connections");

const upsertToTopicAndConsumerGroup = prepareQuery(`
  INSERT OR REPLACE INTO topicsAndConsumerGroups
  (topicName, consumerGroupName, lastActive)
  VALUES
  (?, ?, ?)
`);

module.exports = upsertToTopicAndConsumerGroup;
