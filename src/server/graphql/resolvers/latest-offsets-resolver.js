const fetchLatestOffsetsWithCache = require("server-common/kafka/fetch-latest-offsets-with-cache");

const latestOffsetsResolver = async ({
  partitionNumber,
  metadata: { topic: topicName }
}) => {
  const latestOffsets = await fetchLatestOffsetsWithCache(topicName);
  return latestOffsets[partitionNumber];
};

module.exports = latestOffsetsResolver;
