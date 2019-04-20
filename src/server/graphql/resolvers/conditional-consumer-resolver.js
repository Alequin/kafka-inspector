const targetedConsumer = require("server-common/kafka/targeted-consumer/targeted-consumer");
const topic = require("server-common/kafka/topic-with-cache");
const checkMessageAgainstConditions = require("./check-message-against-conditions");

const allPartitionsFor = async (topicName, kafkaConnectionConfig) => {
  const { partitions } = await topic(topicName, kafkaConnectionConfig);
  return partitions.map((_partition, index) => index);
};

const conditionalConsumerResolver = async (
  _parent,
  { kafkaBrokers, topicName, partitions, minOffset, maxOffset, conditions }
) => {
  const partitionsToConsumerFrom = partitions
    ? partitions
    : await allPartitionsFor(topicName, { kafkaBrokers });

  let matchingMessagesCount = 0;
  let rejectedMessagesCount = 0;
  const messages = [];
  const onMessage = message => {
    const messageMatchesConditions =
      !conditions || checkMessageAgainstConditions(message, conditions);
    console.log("message");

    if (messageMatchesConditions) {
      messages.push(message);
      matchingMessagesCount++;
    } else {
      rejectedMessagesCount++;
    }
  };

  await targetedConsumer(
    {
      topicName,
      partitionsToConsumerFrom: partitionsToConsumerFrom,
      requestedMinOffset: minOffset,
      requestedMaxOffset: maxOffset
    },
    { kafkaBrokers },
    onMessage
  );

  return {
    matchingMessagesCount,
    rejectedMessagesCount,
    messages
  };
};

module.exports = conditionalConsumerResolver;
