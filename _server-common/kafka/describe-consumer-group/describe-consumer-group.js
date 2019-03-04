const consumerGroupInformation = require("./consumer-group-information");
const consumerGroupOffsets = require("./consumer-group-offsets");

const describeConsumerGroup = async (topicName, consumerGroupName) => {
  return {
    ...(await consumerGroupInformation(consumerGroupName)),
    offsets: await consumerGroupOffsets(topicName, consumerGroupInformation)
  };
};

module.exports = describeConsumerGroup;
