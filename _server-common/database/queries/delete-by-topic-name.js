const runQuery = require("../run-query");

const deleteByTopicName = async topicNames => {
  const topicNameList = topicNames.map(name => `'${name}'`).join(",");
  await runQuery(
    `DELETE FROM topicsAndConsumerGroups WHERE topicName IN (${topicNameList})`
  );
};

module.exports = deleteByTopicName;
