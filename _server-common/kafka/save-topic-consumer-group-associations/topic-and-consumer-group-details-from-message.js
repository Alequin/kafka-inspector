const { flow, isEmpty, reject } = require("lodash");
const { seconds } = require("server-common/time-to-milliseconds");
const topicsAndConsumerGroups = require("server-common/database/queries/topics-and-consumer-groups");
const deleteByTopicName = require("server-common/database/queries/delete-by-topic-name");
const deleteByConsumerGroupName = require("server-common/database/queries/delete-by-consumer-group-name");
const checkForDeletedTopicsOrConsumerGroups = require("./check-for-deleted-topics-or-consumer-groups");

const ILLEGAL_CHARACTERS = new RegExp("[^a-zA-Z0-9._-]+", "g");

setInterval(async () => {
  const knownTopicAndConsumerGroups = await topicsAndConsumerGroups();
  const {
    deletedTopicNames,
    deletedConsumerGroupNames
  } = await checkForDeletedTopicsOrConsumerGroups(knownTopicAndConsumerGroups);

  deleteByTopicName(deletedTopicNames);
  deleteByConsumerGroupName(deletedConsumerGroupNames);
}, seconds(30));

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
  shapeIntoObject
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
