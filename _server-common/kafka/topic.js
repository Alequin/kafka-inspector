const { sortBy, flow } = require("lodash");
const kafkaJsAdmin = require("./kafka-connections/kafka-js-admin");
const { failure, identifyError } = require("./error-codes");

const errorMessageForCode = errorCode =>
  `Error Code: ${errorCode} - ${identifyError(errorCode).type}`;

const shapePartitions = topicName => partitions => {
  return partitions.map(partition => {
    return {
      topic: topicName,
      partition: partition.partitionId,
      leader: partition.leader,
      replicas: partition.replicas,
      isr: partition.isr,
      error: failure(partition.partitionErrorCode)
        ? errorMessageForCode(partition.partitionErrorCode)
        : null
    };
  });
};

const sortPartitions = partitions => {
  return sortBy(partitions, ({ partitionId }) => partitionId);
};

const transformPartition = (topicName, partitions) => {
  return flow(
    sortPartitions,
    shapePartitions(topicName)
  )(partitions);
};

const topic = async (topicName, kafkaConnectionConfig) => {
  return kafkaJsAdmin(kafkaConnectionConfig, async admin => {
    const {
      topics: [{ partitions }]
    } = await admin.getTopicMetadata({ topics: [topicName] });

    return {
      name: topicName,
      partitions: transformPartition(topicName, partitions)
    };
  });
};

module.exports = topic;
