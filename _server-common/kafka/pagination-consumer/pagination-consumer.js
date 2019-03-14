const consumer = require("./consumer");
const removeTopicFromConsumer = require("./remove-topic-from-consumer");
const addNewTopicToConsumer = require("./add-new-topic-to-consumer");
const prepareMessagesObject = require("./prepare-message-object");
const validMaxOffsets = require("./valid-max-offsets");

const DEFAULT_OFFSET_RANGE = {
  min: 0,
  max: 0
};

const getValidMinOffset = requestedMinOffset => Math.max(requestedMinOffset, 0);

const paginationConsumer = async (
  { topicName, partitions, offsetRange = DEFAULT_OFFSET_RANGE },
  kafkaConnectionConfig
) => {
  const minOffset = getValidMinOffset(offsetRange.min);

  const [firstPartition, ...remainingPartitions] = partitions;
  const firstPartitionToConsumeFrom = [
    { topic: topicName, partition: firstPartition, offset: minOffset }
  ];
  const consumerToUse = consumer(
    firstPartitionToConsumeFrom,
    kafkaConnectionConfig
  );

  const messages = prepareMessagesObject(partitions);

  const maxOffsets = await validMaxOffsets(
    topicName,
    offsetRange.max,
    kafkaConnectionConfig
  );

  const processedPartitions = [];
  return new Promise(resolve => {
    consumerToUse.on("message", async message => {
      const currentMaxOffset = maxOffsets[message.partition];

      const isMessageWithinRange = message.offset < currentMaxOffset;
      if (isMessageWithinRange) {
        messages[message.partition].push(message);
      }

      const shouldProgressToNextPartition =
        !isMessageWithinRange &&
        !processedPartitions.includes(message.partition);
      if (shouldProgressToNextPartition) {
        processedPartitions.push(message.partition);
        const nextPartition = remainingPartitions.shift();
        if (nextPartition) {
          await removeTopicFromConsumer(consumerToUse, topicName);
          await addNewTopicToConsumer(consumerToUse, {
            topicName,
            partition: nextPartition,
            startingOffset: minOffset
          });
        } else {
          consumerToUse.close();
          resolve(messages);
        }
      }
    });
  });
};

module.exports = paginationConsumer;
