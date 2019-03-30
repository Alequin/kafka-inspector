const accessGlobalKafkaConnections = require("../../access-global-kafka-connections");

const fetchCommittedOffsets = async (
  topicName,
  consumerGroupName,
  kafkaConnectionConfig
) => {
  const {
    kafkaJs: { admin }
  } = accessGlobalKafkaConnections(kafkaConnectionConfig);

  const committedOffsets = await admin.fetchOffsets({
    topic: topicName,
    groupId: consumerGroupName
  });

  return committedOffsets.map(({ partition, offset }) => {
    return {
      partition,
      committedOffset: Number.parseInt(offset)
    };
  });
};

module.exports = fetchCommittedOffsets;
