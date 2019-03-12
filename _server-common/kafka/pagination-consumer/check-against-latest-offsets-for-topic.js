const fetchLatestOffset = require("../fetch-latest-offsets");

const checkAgainstLatestOffsetForTopic = (topicName, kafkaConnectionConfig) => {
  const latestOffsets = fetchLatestOffset(topicName, kafkaConnectionConfig);
  return async (maxOffset, partition) => {
    const latestOffset = (await latestOffsets)[partition];
    return Math.min(latestOffset, maxOffset);
  };
};

module.exports = checkAgainstLatestOffsetForTopic;
