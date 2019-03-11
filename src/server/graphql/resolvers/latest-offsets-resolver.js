const fetchLatestOffsetsWithCache = require("server-common/kafka/fetch-latest-offsets-with-cache");

const latestOffsetsResolver = async (
  { partitionNumber, metadata: { topic: topicName } },
  _args,
  { kafkaConnectionConfig }
) => {
  const latestOffsets = await fetchLatestOffsetsWithCache(
    topicName,
    kafkaConnectionConfig
  );
  return latestOffsets[partitionNumber];
};

module.exports = latestOffsetsResolver;
