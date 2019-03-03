const listTopicsWithCache = require("../list-topics-with-cache");
const listConsumerGroupsWithCache = require("../list-consumer-groups-with-cache");

const filterForDeletedConsumerGroups = async knownTopicAndConsumerGroups => {
  const consumerGroupNames = await listConsumerGroupsWithCache();
  return knownTopicAndConsumerGroups.filter(
    ({ consumerGroupName }) => !consumerGroupNames.includes(consumerGroupName)
  );
};

const checkForMissingTopicNames = topics => ({ topicName }) => {
  return !topics.find(({ name }) => topicName === name);
};

const filterForDeletedTopics = async knownTopicAndConsumerGroups => {
  const topics = await listTopicsWithCache();
  return knownTopicAndConsumerGroups.filter(checkForMissingTopicNames(topics));
};

const checkForDeletedTopicsOrConsumerGroups = async knownTopicAndConsumerGroups => {
  const deletedTopicNames = filterForDeletedTopics(
    knownTopicAndConsumerGroups
  ).then(rows => rows.map(({ topicName }) => topicName));

  const deletedConsumerGroupNames = filterForDeletedConsumerGroups(
    knownTopicAndConsumerGroups
  ).then(rows => rows.map(({ consumerGroupName }) => consumerGroupName));

  return {
    deletedTopicNames: await deletedTopicNames,
    deletedConsumerGroupNames: await deletedConsumerGroupNames
  };
};

module.exports = checkForDeletedTopicsOrConsumerGroups;
