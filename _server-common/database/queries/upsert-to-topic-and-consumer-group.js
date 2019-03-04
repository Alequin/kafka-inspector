const { query } = require("../sqlite-connections");

const upsertToTopicAndConsumerGroup = async (...values) => {
  return await query(
    `
  INSERT OR REPLACE INTO topicsAndConsumerGroups
  (topicName, consumerGroupName, lastActive)
  VALUES
  (?, ?, ?)
`,
    values
  );
};

module.exports = upsertToTopicAndConsumerGroup;
