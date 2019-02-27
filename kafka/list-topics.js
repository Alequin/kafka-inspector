const flow = require("lodash/flow");
const map = require("lodash/map");
const pickBy = require("lodash/pickBy");

const listTopics = async ({ kafkaNode }) => {
  return new Promise((resolve, reject) => {
    kafkaNode.admin.listTopics((error, response) => {
      error ? reject(error) : resolve(transformToTopicList(response));
    });
  });
};

const transformToTopicList = flow(
  extractTopicsMetadata,
  removePrivateTopics,
  mapTopicsDetailsToList
);

function extractTopicsMetadata(listTopicsResponse) {
  return listTopicsResponse[1].metadata;
}

function removePrivateTopics(allTopics) {
  return pickBy(allTopics, (_topicDetails, topicName) => {
    return !topicName.startsWith("_");
  });
}

function mapTopicsDetailsToList(topics) {
  return map(topics, (topicDetails, topicName) => {
    return {
      name: topicName,
      partitions: Object.values(topicDetails)
    };
  });
}

module.exports = listTopics;
