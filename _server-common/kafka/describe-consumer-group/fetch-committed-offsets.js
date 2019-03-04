const accessKafkaConnections = require("../access-kafka-connections");

const {
  kafkaJs: { admin }
} = accessKafkaConnections();

const fetchCommittedOffsets = async (topicName, consumerGroupName) => {
  return await admin.fetchOffsets({
    topic: topicName,
    groupId: consumerGroupName
  });
};

module.exports = fetchCommittedOffsets;
