const { sortBy, flow } = require("lodash");
const accessGlobalKafkaConnections = require("./access-global-kafka-connections");
const { failure, identifyError } = require("./error-codes");

const shapePartitions = topicName => {
  return partitions => {
    return partitions.map(partition => {
      return {
        topic: topicName,
        partition: partition.partitionId,
        leader: partition.leader,
        replicas: partition.replicas,
        isr: partition.isr
      };
    });
  };
};

const sortPartitions = partitions => {
  return sortBy(partitions, ({ partitionId }) => partitionId);
};

const checkForErrors = partitions => {
  partitions.forEach(({ partitionErrorCode: errorCode }) => {
    if (failure(errorCode)) {
      const error = identifyError(errorCode);
      throw new Error(JSON.stringify(error));
    }
  });

  return partitions;
};

const transformPartition = (topicName, partitions) => {
  return flow(
    checkForErrors,
    sortPartitions,
    shapePartitions(topicName)
  )(partitions);
};

const topic = async topicName => {
  const {
    kafkaJs: { admin }
  } = accessGlobalKafkaConnections();

  const {
    topics: [{ partitions }]
  } = await admin.getTopicMetadata({ topics: [topicName] });

  return {
    name: topicName,
    partitions: transformPartition(topicName, partitions)
  };
};

module.exports = topic;
