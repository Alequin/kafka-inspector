const runQuery = require("../run-query");

const upsertToTopicAndConsumerGroup = async (...values) => {
  return await runQuery(
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
