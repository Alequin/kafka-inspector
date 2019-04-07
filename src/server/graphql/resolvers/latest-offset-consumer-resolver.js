const uuid = require("uuid/v4");
const { PubSub } = require("graphql-subscriptions");
const { seconds } = require("server-common/time-to-milliseconds");
const anySubscriptionsExistFor = require("./utils/any-subscriptions-exist-for");

const kafkaNodeConsumerGroup = require("server-common/kafka/kafka-connections/kafka-node-consumer-group");

const pubSub = new PubSub();

const consumeMessages = (consumer, subscriptionKey, onEmptyMessageQueue) => {
  return new Promise(resolve => {
    let emptyQueueTimeout = null;
    const messageQueue = [];

    consumer.on("message", message => {
      messageQueue.push(message);
      const shouldTimeoutBeSet = !emptyQueueTimeout;

      if (shouldTimeoutBeSet) {
        emptyQueueTimeout = setTimeout(() => {
          const shouldStopConsuming = !anySubscriptionsExistFor(
            subscriptionKey,
            pubSub
          );
          if (shouldStopConsuming) {
            resolve();
          } else {
            onEmptyMessageQueue(messageQueue.splice(0));
            emptyQueueTimeout = null;
          }
        }, seconds(2));
      }
    });
  });
};

const latestOffsetConsumerResolver = (_parent, { topicName, kafkaBrokers }) => {
  const subscriptionKey = `${kafkaBrokers.join("")}-${topicName}`;

  const isAlreadyConsuming = anySubscriptionsExistFor(subscriptionKey, pubSub);
  const subAsyncIterator = pubSub.asyncIterator([subscriptionKey]);
  if (isAlreadyConsuming) return subAsyncIterator;

  kafkaNodeConsumerGroup(
    { kafkaBrokers },
    { topicsToConsumeFrom: [topicName], groupId: `k-inspect-${uuid()}` },
    async consumer =>
      await consumeMessages(consumer, subscriptionKey, messages => {
        pubSub.publish(subscriptionKey, {
          latestOffsetConsumer: messages
        });
      })
  );
  return subAsyncIterator;
};

module.exports = latestOffsetConsumerResolver;
