const { sumBy } = require("lodash");
const fetchLatestOffsets = require("../utils/fetch-latest-offsets");
const fetchCommittedOffsets = require("./utils/fetch-committed-offsets");
const aggregateOffsetDetails = require("./utils/aggregate-offset-details");

const calculateTotalLag = offsetDetails => {
  return sumBy(offsetDetails, ({ lag }) => lag);
};

const calculateTotalMessages = offsetDetails => {
  return sumBy(offsetDetails, ({ latestOffset }) => latestOffset);
};

const consumerGroupOffsets = async (topicName, consumerGroupName) => {
  const latestOffsets = await fetchLatestOffsets(topicName);
  const committedOffsets = await fetchCommittedOffsets(
    topicName,
    consumerGroupName
  );

  const offsetDetails = aggregateOffsetDetails(latestOffsets, committedOffsets);

  const totalMessages = calculateTotalMessages(offsetDetails);
  const totalLag = calculateTotalLag(offsetDetails);

  return {
    sumOfLatestOffsets: totalMessages,
    sumOfLag: totalLag,
    partitions: offsetDetails
  };
};

module.exports = consumerGroupOffsets;
