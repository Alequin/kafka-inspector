const { mapValues } = require("lodash");
const fetchLatestOffsets = require("../fetch-latest-offsets");

const validMaxOffsets = async (
  topicName,
  requestedMaxOffset,
  kafkaConnectionConfig
) => {
  const latestOffsets = await fetchLatestOffsets(
    topicName,
    kafkaConnectionConfig
  );

  return mapValues(latestOffsets, latestOffset => {
    // Minus one as the latest offset is one more than the last messages offset
    const lastMessageOffset = latestOffset - 1;
    return Math.min(requestedMaxOffset, lastMessageOffset);
  });
};

module.exports = validMaxOffsets;
