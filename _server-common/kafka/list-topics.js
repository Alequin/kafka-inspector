const { flow, map, pickBy } = require("lodash");
const fetchBrokerDetailsAndTopicNames = require("./utils/fetch-broker-details-and-topics-names");

function mapTopicsDetailsToList(topics) {
  return map(topics, (topicDetails, topicName) => {
    return {
      name: topicName,
      partitions: Object.values(topicDetails)
    };
  });
}

function removePrivateTopics(allTopics) {
  return pickBy(allTopics, (_topicDetails, topicName) => {
    return !topicName.startsWith("_");
  });
}

function extractTopicsMetadata(listTopicsResponse) {
  return listTopicsResponse[1].metadata;
}

const transformToTopicList = flow(
  extractTopicsMetadata,
  removePrivateTopics,
  mapTopicsDetailsToList
);

const listTopics = async kafkaConnectionConfig => {
  return fetchBrokerDetailsAndTopicNames(kafkaConnectionConfig).then(
    transformToTopicList
  );
};

module.exports = listTopics;
