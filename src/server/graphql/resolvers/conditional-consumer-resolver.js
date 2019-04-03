const { PubSub } = require("graphql-subscriptions");
const uuid = require("uuid/v4");
const { seconds } = require("server-common/time-to-milliseconds");
const targetedConsumer = require("server-common/kafka/targeted-consumer/targeted-consumer");
const topic = require("server-common/kafka/topic-with-cache");
const anySubscriptionsExistFor = require("./utils/any-subscriptions-exist-for");
const checkMessageAgainstConditions = require("./check-message-against-conditions");

const pubSub = new PubSub();

const messageProcessor = (subscriptionKey, conditions) => {
  let matchingMessagesCount = 0;
  let rejectedMessagesCount = 0;
  let publishMessagesTimeout = null;
  const messageQueue = [];

  return (message, consumer) => {
    console.log("message", matchingMessagesCount, rejectedMessagesCount);

    const messageMatchesConditions =
      !conditions || checkMessageAgainstConditions(message, conditions);

    if (messageMatchesConditions) {
      messageQueue.push(message);
      matchingMessagesCount++;
    } else {
      rejectedMessagesCount++;
    }

    const shouldTimeoutBeSet = !publishMessagesTimeout;
    if (shouldTimeoutBeSet) {
      publishMessagesTimeout = setTimeout(() => {
        const shouldCloseConsumer = !anySubscriptionsExistFor(
          subscriptionKey,
          pubSub
        );

        if (shouldCloseConsumer) {
          consumer.close(() => {});
        } else {
          const messagesToPublish = messageQueue.splice(0);
          pubSub.publish(subscriptionKey, {
            conditionalConsumer: {
              matchingMessagesCount,
              rejectedMessagesCount,
              messages: messagesToPublish
            }
          });
          publishMessagesTimeout = null;
        }
      }, seconds(2));
    }
  };
};

const allPartitionsFor = async (topicName, kafkaConnectionConfig) => {
  const { partitions } = await topic(topicName, kafkaConnectionConfig);
  return partitions.map((_partition, index) => index);
};

const conditionalConsumerResolver = async (
  _parent,
  { kafkaBrokers, topicName, partitions, minOffset, maxOffset, conditions }
) => {
  const subscriptionKey = uuid();
  const subscription = pubSub.asyncIterator([subscriptionKey]);

  const partitionsToConsumerFrom = partitions
    ? partitions
    : await allPartitionsFor(topicName, { kafkaBrokers });

  const onMessage = messageProcessor(subscriptionKey, conditions);

  targetedConsumer(
    {
      topicName,
      partitionsToConsumerFrom: partitionsToConsumerFrom,
      requestedMinOffset: minOffset,
      requestedMaxOffset: maxOffset
    },
    { kafkaBrokers },
    onMessage
  );

  return subscription;
};

module.exports = conditionalConsumerResolver;
