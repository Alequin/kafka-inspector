const { uniqBy, reject, isNull, orderBy, flow } = require("lodash");
const topicAndConsumerGroupDetailsFromMessage = require("./topic-and-consumer-group-details-from-message");

const removeDuplicatesPairs = topicConsumerGroupPairs => {
  return uniqBy(
    topicConsumerGroupPairs,
    ({ topicName, consumerGroup }) => topicName + consumerGroup
  );
};

const orderDescendingByLastActiveTime = topicConsumerGroupPairs => {
  return orderBy(
    topicConsumerGroupPairs,
    ["consumerGroup.lastActive"],
    ["desc"]
  );
};

const removeNullElements = topicConsumerGroupPairs => {
  return reject(topicConsumerGroupPairs, isNull);
};

const transformMessagesToTopicConsumerGroupPair = ({ messages }) => {
  return messages.map(topicAndConsumerGroupDetailsFromMessage);
};

const processMessageBatch = flow(
  transformMessagesToTopicConsumerGroupPair,
  removeNullElements,
  orderDescendingByLastActiveTime,
  removeDuplicatesPairs
);

module.exports = processMessageBatch;
