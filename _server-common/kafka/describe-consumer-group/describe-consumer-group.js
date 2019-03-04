const consumerGroupInformation = require("./consumer-group-information");
const consumerGroupOffsets = require("./consumer-group-offsets");

const describeConsumerGroup = async (topicName, consumerGroupName) => {
  const information = consumerGroupInformation(consumerGroupName);
  const offsets = consumerGroupOffsets(topicName, consumerGroupName);

  return {
    ...(await information),
    offsets: await offsets
  };
};

module.exports = describeConsumerGroup;
