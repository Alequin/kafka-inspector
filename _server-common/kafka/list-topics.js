const flow = require("lodash/flow");
const map = require("lodash/map");
const pickBy = require("lodash/pickBy");
const accessGlobalKafkaConnections = require("./access-global-kafka-connections");

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
  const { kafkaNode } = accessGlobalKafkaConnections(kafkaConnectionConfig);

  return new Promise((resolve, reject) => {
    kafkaNode.admin.listTopics((error, response) => {
      error ? reject(error) : resolve(transformToTopicList(response));
    });
  });
};

module.exports = listTopics;
