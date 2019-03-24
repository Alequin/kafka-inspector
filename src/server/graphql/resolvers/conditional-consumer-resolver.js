const targetedConsumer = require("server-common/kafka/targeted-consumer/targeted-consumer");
const topic = require("server-common/kafka/topic-with-cache");

const allPartitionsFor = async (topicName, kafkaConnectionConfig) => {
  const { partitions } = await topic(topicName, kafkaConnectionConfig);
  return partitions.map((_partition, index) => index);
};

const conditionalConsumerResolver = async (
  _parent,
  { topicName, partitions, minOffset, maxOffset },
  { kafkaConnectionConfig }
) => {
  const partitionsToConsumerFrom = partitions
    ? partitions
    : await allPartitionsFor(topicName, kafkaConnectionConfig);

  let matchingMessagesCount = 0;
  let rejectedMessagesCount = 0;
  const messages = [];
  const onMessage = message => {
    matchingMessagesCount++;
    messages.push(message);
  };

  await targetedConsumer(
    {
      topicName,
      partitionsToConsumerFrom: partitionsToConsumerFrom,
      requestedMinOffset: minOffset,
      requestedMaxOffset: maxOffset
    },
    kafkaConnectionConfig,
    onMessage
  );

  return {
    messages,
    matchingMessagesCount,
    rejectedMessagesCount
  };
};

module.exports = conditionalConsumerResolver;
