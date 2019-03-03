const { query } = require("../sqlite-connections");

const deleteByTopicName = async consumerGroupNames => {
  const consumerGroupNameList = consumerGroupNames
    .map(name => `'${name}'`)
    .join(",");

  await query(
    `DELETE FROM topicsAndConsumerGroups WHERE consumerGroupName IN (${consumerGroupNameList})`
  );
};

module.exports = deleteByTopicName;
