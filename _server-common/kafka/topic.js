const accessGlobalKafkaConnections = require("./access-global-kafka-connections");
const { failure, identifyError } = require("./error-codes");

const transformPartition = topicName => {
  return partition => {
    return {
      topic: topicName,
      partition: partition.partitionId,
      leader: partition.leader,
      replicas: partition.replicas,
      isr: partition.isr
    };
  };
};

const checkForErrors = ({ partitionErrorCode: errorCode }) => {
  if (failure(errorCode)) {
    const error = identifyError(errorCode);
    throw new Error(JSON.stringify(error));
  }
};

const topic = async topicName => {
  const {
    kafkaJs: { admin }
  } = accessGlobalKafkaConnections();

  const {
    topics: [{ partitions }]
  } = await admin.getTopicMetadata({ topics: [topicName] });

  partitions.forEach(checkForErrors);

  return {
    name: topicName,
    partitions: partitions.map(transformPartition(topicName))
  };
};

module.exports = topic;
