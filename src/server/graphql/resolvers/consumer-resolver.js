const paginationConsumer = require("server-common/kafka/pagination-consumer/pagination-consumer");
const topic = require("server-common/kafka/topic-with-cache");

const allPartitionsFor = async (topicName, kafkaConnectionConfig) => {
  const { partitions } = await topic(topicName, kafkaConnectionConfig);
  return partitions.map((_partition, index) => index);
};

const consumerResolver = async (
  _parent,
  { topicName, partitions, minOffset, maxOffset },
  { kafkaConnectionConfig }
) => {
  const partitionsToConsumerFrom = partitions
    ? partitions
    : await allPartitionsFor(topicName, kafkaConnectionConfig);

  const messages = [];
  const onMessage = message => {
    messages.push(message);
  };

  await paginationConsumer(
    {
      topicName,
      partitionsToConsumerFrom: partitionsToConsumerFrom,
      requestedMinOffset: minOffset,
      requestedMaxOffset: maxOffset
    },
    kafkaConnectionConfig,
    onMessage
  );

  return messages;
};

module.exports = consumerResolver;
