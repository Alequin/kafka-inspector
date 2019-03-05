const accessGlobalKafkaConnections = require("../access-global-kafka-connections");

const fetchCommittedOffsets = async (topicName, consumerGroupName) => {
  const {
    kafkaJs: { admin }
  } = accessGlobalKafkaConnections();

  return await admin.fetchOffsets({
    topic: topicName,
    groupId: consumerGroupName
  });
};

module.exports = fetchCommittedOffsets;
