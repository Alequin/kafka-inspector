const kafkaJsAdmin = require("../../kafka-connections/kafka-js-admin");

const fetchCommittedOffsets = async (
  topicName,
  consumerGroupName,
  kafkaConnectionConfig
) =>
  kafkaJsAdmin(kafkaConnectionConfig, async admin => {
    const committedOffsets = await admin.fetchOffsets({
      topic: topicName,
      groupId: consumerGroupName
    });

    return committedOffsets.map(({ partition, offset }) => ({
      partition,
      committedOffset: Number.parseInt(offset)
    }));
  });

module.exports = fetchCommittedOffsets;
