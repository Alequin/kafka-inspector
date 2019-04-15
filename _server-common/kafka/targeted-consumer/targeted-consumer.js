const { first } = require("lodash");
const systemId = require("../../config/system-id");
const kafkaNodeConsumer = require("../kafka-connections/kafka-node-consumer");
const validMaxOffsets = require("./valid-max-offsets");
const removeTopicFromConsumer = require("./remove-topic-from-consumer");
const addNewTopicToConsumer = require("./add-new-topic-to-consumer");

const removeCurrentPartition = (currentPartition, partitions) => {
  return partitions.filter(partition => partition !== currentPartition);
};

const consumeMessage = (
  consumer,
  { topicName, minOffset, maxOffsets, partitionsToConsumerFrom },
  onMessageConsumedCallback
) => {
  const processedPartitions = {};
  const remainingPartitions = removeCurrentPartition(
    first(consumer.payloads).partition,
    partitionsToConsumerFrom
  );
  return new Promise(resolve => {
    consumer.on("message", async message => {
      const currentMaxOffset = maxOffsets[message.partition];

      const isMessageWithinOffsetRange = message.offset <= currentMaxOffset;
      if (isMessageWithinOffsetRange) {
        onMessageConsumedCallback(message, consumer);
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
          resolve();
        }
      }
    });
  });
};

const validMinOffset = requestedMinOffset => Math.max(requestedMinOffset, 0);

const targetedConsumer = async (
  {
    topicName,
    partitionsToConsumerFrom,
    requestedMinOffset = 0,
    requestedMaxOffset = Number.MAX_VALUE
  },
  kafkaConnectionConfig,
  onMessageConsumedCallback
) => {
  const minOffset = validMinOffset(requestedMinOffset);

  const maxOffsets = await validMaxOffsets(
    topicName,
    requestedMaxOffset,
    kafkaConnectionConfig
  );

  return await kafkaNodeConsumer(
    kafkaConnectionConfig,
    {
      toConsumeFrom: [
        {
          topic: topicName,
          partition: first(partitionsToConsumerFrom),
          offset: minOffset
        }
      ],
      config: {
        groupId: systemId()
      }
    },
    async consumer => {
      return await consumeMessage(
        consumer,
        { topicName, minOffset, maxOffsets, partitionsToConsumerFrom },
        onMessageConsumedCallback
      );
    }
  );
};

module.exports = targetedConsumer;
