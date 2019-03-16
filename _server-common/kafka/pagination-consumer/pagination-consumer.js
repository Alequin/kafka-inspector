const { first } = require("lodash");
const consumer = require("./consumer");
const validMaxOffsets = require("./valid-max-offsets");
const removeTopicFromConsumer = require("./remove-topic-from-consumer");
const addNewTopicToConsumer = require("./add-new-topic-to-consumer");

const DEFAULT_OFFSET_RANGE = {
  min: 0,
  max: 0
};

const removeCurrentPartition = (currentPartition, partitions) => {
  return partitions.filter(partition => partition !== currentPartition);
};

const consumeMessage = (
  consumer,
  { topicName, minOffset, maxOffsets, partitions },
  onMessageConsumedCallback
) => {
  const processedPartitions = {};
  const remainingPartitions = removeCurrentPartition(
    first(consumer.payloads).partition,
    partitions
  );
  return new Promise(resolve => {
    consumer.on("message", async message => {
      const currentMaxOffset = maxOffsets[message.partition];

      const isMessageWithinOffsetRange = message.offset <= currentMaxOffset;
      if (isMessageWithinOffsetRange) {
        onMessageConsumedCallback(message, message.partition);
      }

      const shouldProgressToNextPartition =
        message.offset >= currentMaxOffset &&
        !processedPartitions[message.partition];
      if (shouldProgressToNextPartition) {
        processedPartitions[message.partition] = true;
        const nextPartition = remainingPartitions.shift();
        if (nextPartition) {
          await removeTopicFromConsumer(consumer, topicName);
          await addNewTopicToConsumer(consumer, {
            topicName,
            partition: nextPartition,
            startingOffset: minOffset
          });
        } else {
          consumer.close();
          resolve();
        }
      }
    });
  });
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
