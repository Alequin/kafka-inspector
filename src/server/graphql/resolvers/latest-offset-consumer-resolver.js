const uuid = require("uuid/v4");
const { PubSub } = require("graphql-subscriptions");
const { seconds } = require("server-common/time-to-milliseconds");
const anySubscriptionsExistFor = require("./utils/any-subscriptions-exist-for");

const kafkaNodeConsumerGroup = require("server-common/kafka/kafka-connections/kafka-node-consumer");

const pubSub = new PubSub();

const consumeMessages = (
  consumer,
  closeConnection,
  subscriptionKey,
  onEmptyMessageQueue
) => {
  let emptyQueueTimeout = null;
  const messageQueue = [];
  consumer.on("message", message => {
    messageQueue.push(message);
    const shouldTimeoutBeSet = !emptyQueueTimeout;

    if (shouldTimeoutBeSet) {
      emptyQueueTimeout = setTimeout(() => {
        const shouldCloseConsumer = !anySubscriptionsExistFor(
          subscriptionKey,
          pubSub
        );
        if (shouldCloseConsumer) {
          closeConnection();
        } else {
          onEmptyMessageQueue(messageQueue.splice(0));
          emptyQueueTimeout = null;
        }
      }, seconds(2));
    }
  });
};

const latestOffsetConsumerResolver = (_parent, { topicName, kafkaBrokers }) => {
  const subscriptionKey = `${kafkaBrokers.join("")}-${topicName}`;

  const isAlreadyConsuming = anySubscriptionsExistFor(subscriptionKey, pubSub);
  const subAsyncIterator = pubSub.asyncIterator([subscriptionKey]);
  if (isAlreadyConsuming) return subAsyncIterator;

  kafkaNodeConsumerGroup(
    { kafkaBrokers },
    { topicsToConsumerFrom: [topicName], groupId: `k-inspect-${uuid()}` },
    async (consumer, closeConnection) =>
      consumeMessages(consumer, closeConnection, subscriptionKey, messages => {
        pubSub.publish(subscriptionKey, {
          latestOffsetConsumer: messages
        });
      })
  );
  return subAsyncIterator;
};

module.exports = latestOffsetConsumerResolver;
