const { first } = require("lodash");
const removeTopicFromConsumer = require("./remove-topic-from-consumer");
const addNewTopicToConsumer = require("./add-new-topic-to-consumer");

const removeCurrentPartition = (currentPartition, partitions) => {
  return partitions.filter(partition => partition !== currentPartition);
};

const consumeMessage = (
  consumer,
  { topicName, minOffset, maxOffsets, partitions },
  onMessageConsumedCallback
) => {
  return new Promise(resolve => {
    const processedPartitions = {};
    const remainingPartitions = removeCurrentPartition(
      first(consumer.payloads).partition,
      partitions
    );
    consumer.on("message", async message => {
      const currentMaxOffset = maxOffsets[message.partition];

      const isMessageWithinOffsetRange = message.offset < currentMaxOffset;
      if (isMessageWithinOffsetRange) {
        onMessageConsumedCallback(message, message.partition);
      }

      const shouldProgressToNextPartition =
        !isMessageWithinOffsetRange && !processedPartitions[message.partition];
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

module.exports = consumeMessage;
