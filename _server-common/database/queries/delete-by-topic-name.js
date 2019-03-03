const { query } = require("../sqlite-connections");

const deleteByTopicName = async topicNames => {
  const topicNameList = topicNames.map(name => `'${name}'`).join(",");
  await query(
    `DELETE FROM topicsAndConsumerGroups WHERE topicName IN (${topicNameList})`
  );
};

module.exports = deleteByTopicName;
