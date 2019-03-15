const { first } = require("lodash");
const consumer = require("./consumer");
const validMaxOffsets = require("./valid-max-offsets");
const consumeMessage = require("./consume-message");

const DEFAULT_OFFSET_RANGE = {
  min: 0,
  max: 0
};

const validMinOffset = requestedMinOffset => Math.max(requestedMinOffset, 0);

const paginationConsumer = async (
  { topicName, partitions, offsetRange = DEFAULT_OFFSET_RANGE },
  kafkaConnectionConfig,
  onMessageConsumedCallback
) => {
  const minOffset = validMinOffset(offsetRange.min);

  const firstPartitionToConsumeFrom = [
    { topic: topicName, partition: first(partitions), offset: minOffset }
  ];
  const consumerToUse = consumer(
    firstPartitionToConsumeFrom,
    kafkaConnectionConfig
  );

  const maxOffsets = await validMaxOffsets(
    topicName,
    offsetRange.max,
    kafkaConnectionConfig
  );

  return consumeMessage(
    consumerToUse,
    { topicName, minOffset, maxOffsets, partitions },
    onMessageConsumedCallback
  );
};

module.exports = paginationConsumer;
