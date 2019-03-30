const consumerGroupOffsets = require("server-common/kafka/describe-consumer-group/consumer-group-offsets");

const offsetsResolver = async (
  _parent,
  { topicName, consumerGroupName },
  { kafkaConnectionConfig }
) => {
  return await consumerGroupOffsets(
    topicName,
    consumerGroupName,
    kafkaConnectionConfig
  );
};

module.exports = offsetsResolver;
