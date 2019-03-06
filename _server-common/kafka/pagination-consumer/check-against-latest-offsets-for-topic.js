const fetchLatestOffset = require("../utils/fetch-latest-offsets");

const checkAgainstLatestOffsetForTopic = topicName => {
  const latestOffsets = fetchLatestOffset(topicName);
  return async (maxOffset, partition) => {
    const latestOffset = (await latestOffsets)[partition];
    return Math.min(latestOffset, maxOffset);
  };
};

module.exports = checkAgainstLatestOffsetForTopic;
