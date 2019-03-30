const { sumBy } = require("lodash");
const fetchLatestOffsetsWithCache = require("../fetch-latest-offsets-with-cache");
const fetchCommittedOffsets = require("./utils/fetch-committed-offsets");
const aggregateOffsetDetails = require("./utils/aggregate-offset-details");

const calculateTotalLag = offsetDetails => {
  return sumBy(offsetDetails, ({ lag }) => lag);
};

const calculateSumOfCommittedOffsets = offsetDetails => {
  return sumBy(offsetDetails, ({ committedOffset }) => committedOffset);
};

const calculateSumOfLatestOffsets = offsetDetails => {
  return sumBy(offsetDetails, ({ latestOffset }) => latestOffset);
};

const consumerGroupOffsets = async (
  topicName,
  consumerGroupName,
  kafkaConnectionConfig
) => {
  const latestOffsets = await fetchLatestOffsetsWithCache(
    topicName,
    kafkaConnectionConfig
  );
  const committedOffsets = await fetchCommittedOffsets(
    topicName,
    consumerGroupName,
    kafkaConnectionConfig
  );

  const offsetDetails = aggregateOffsetDetails(latestOffsets, committedOffsets);

  return {
    sumOfLatestOffsets: calculateSumOfLatestOffsets(offsetDetails),
    sumOfCommittedOffsets: calculateSumOfCommittedOffsets(offsetDetails),
    sumOfLag: calculateTotalLag(offsetDetails),
    partitions: offsetDetails
  };
};

module.exports = consumerGroupOffsets;
