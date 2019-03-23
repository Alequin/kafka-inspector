const uuid = require("uuid/v4");
const { PubSub } = require("graphql-subscriptions");
const { seconds } = require("server-common/time-to-milliseconds");
const accessGlobalKafkaConnections = require("server-common/kafka/access-global-kafka-connections");

const pubSub = new PubSub();

const anySubscriptionsExistFor = subscriptionKey => {
  const subscriptions = Object.keys(pubSub.ee._events);
  return subscriptions.includes(subscriptionKey);
};

const consumeMessages = (consumer, subscriptionKey, onEmptyMessageQueue) => {
  let emptyQueueTimeout = null;
  const messageQueue = [];

  consumer.on("message", message => {
    messageQueue.push(message);
    const shouldTimeoutBeSet = !emptyQueueTimeout;

    if (shouldTimeoutBeSet) {
      emptyQueueTimeout = setTimeout(() => {
        const shouldCloseConsumer = !anySubscriptionsExistFor(subscriptionKey);

        if (shouldCloseConsumer) {
          consumer.close(() => {});
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

  const isAlreadyConsuming = anySubscriptionsExistFor(subscriptionKey);
  const subAsyncIterator = pubSub.asyncIterator([subscriptionKey]);
  if (isAlreadyConsuming) return subAsyncIterator;

  const {
    kafkaNode: { consumerGroup }
  } = accessGlobalKafkaConnections({ kafkaBrokers });

  const consumerGroupName = `k-inspect-${uuid()}`;

  const consumer = consumerGroup({
    topicNames: [topicName],
    groupId: consumerGroupName
  });

  consumeMessages(consumer, subscriptionKey, messages => {
    pubSub.publish(subscriptionKey, {
      latestOffsetConsumer: messages
    });
  });

  return subAsyncIterator;
};

module.exports = latestOffsetConsumerResolver;
