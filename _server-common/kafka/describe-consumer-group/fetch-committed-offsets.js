const accessKafkaConnections = require("../access-kafka-connections");

const fetchCommittedOffsets = async (topicName, consumerGroupName) => {
  const {
    kafkaJs: { admin }
  } = accessKafkaConnections();

  return await admin.fetchOffsets({
    topic: topicName,
    groupId: consumerGroupName
  });
};

module.exports = fetchCommittedOffsets;
