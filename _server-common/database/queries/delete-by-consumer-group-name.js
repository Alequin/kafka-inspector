const runQuery = require("../run-query");

const deleteByTopicName = async consumerGroupNames => {
  const consumerGroupNameList = consumerGroupNames
    .map(name => `'${name}'`)
    .join(",");

  await runQuery(
    `DELETE FROM topicsAndConsumerGroups WHERE consumerGroupName IN (${consumerGroupNameList})`
  );
};

module.exports = deleteByTopicName;
