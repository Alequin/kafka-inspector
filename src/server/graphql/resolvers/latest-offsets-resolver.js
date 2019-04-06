const fetchLatestOffsetsWithCache = require("server-common/kafka/fetch-latest-offsets-with-cache");

const latestOffsetsResolver = async (
  { partitionNumber, metadata: { topic: topicName } },
  _args,
  { kafkaConfigSettings }
) => {
  const latestOffsets = await fetchLatestOffsetsWithCache(
    topicName,
    kafkaConfigSettings
  );
  return latestOffsets[partitionNumber];
};

module.exports = latestOffsetsResolver;
