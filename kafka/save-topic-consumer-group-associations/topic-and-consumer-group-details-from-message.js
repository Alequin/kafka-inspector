const { flow, isEmpty, reject } = require("lodash");
const listTopics = require("../list-topics");
const listConsumerGroups = require("../list-consumer-groups");

const ILLEGAL_CHARACTERS = new RegExp("[^a-zA-Z0-9._-]+", "g");

const confirmTopicAndConsumerGroupAreValid = () => {
  const validTopicNames = listTopics().then(topics => {
    return topics.map(({ name }) => name);
  });
  const validConsumerGroupNames = listConsumerGroups();

  return async topicAndConsumerGroup => {
    if (!topicAndConsumerGroup) return null;
    const isTopicNameValid = (await validTopicNames).includes(
      topicAndConsumerGroup.topicName
    );
    const isConsumerGroupValid = (await validConsumerGroupNames).includes(
      topicAndConsumerGroup.consumerGroup.name
    );

    return isTopicNameValid && isConsumerGroupValid
      ? topicAndConsumerGroup
      : null;
  };
};

const shapeIntoObject = consumerGroupAndTopic => {
  // Anything not of length two is not a Consumer Group / Topic pair
  const isValid = consumerGroupAndTopic.length === 2;
  return isValid
    ? {
        consumerGroup: { name: consumerGroupAndTopic[0] },
        topicName: consumerGroupAndTopic[1]
      }
    : null;
};

const removeEmptyStringsFromArray = consumerGroupAndTopic => {
  return reject(consumerGroupAndTopic, isEmpty);
};

const splitKeyIntoConsumerGroupAndTopicArray = key => {
  return key.split(ILLEGAL_CHARACTERS);
};

const transformKeyToString = key => {
  return Buffer.from(key).toString();
};

const extractTopicAndConsumerGroupFromKey = flow(
  transformKeyToString,
  splitKeyIntoConsumerGroupAndTopicArray,
  removeEmptyStringsFromArray,
  shapeIntoObject,
  confirmTopicAndConsumerGroupAreValid()
);

const topicAndConsumerGroupDetailsFromMessage = async message => {
  const topicWithConsumerGroup = await extractTopicAndConsumerGroupFromKey(
    message.key
  );
  if (!topicWithConsumerGroup) return null;
  topicWithConsumerGroup.consumerGroup.lastActive = message.timestamp;

  return topicWithConsumerGroup;
};

module.exports = topicAndConsumerGroupDetailsFromMessage;
