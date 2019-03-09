const { isEqual } = require("lodash");

const checkAllPartitionsMatch = (latestOffsets, committedOffsets) => {
  const latestOffsetPartitions = Object.keys(latestOffsets);
  const committedOffsetsPartitions = committedOffsets.map(({ partition }) =>
    partition.toString()
  );
  return isEqual(latestOffsetPartitions, committedOffsetsPartitions);
};

const aggregateOffsetDetails = (latestOffsets, committedOffsets) => {
  const arePartitionsSame = checkAllPartitionsMatch(
    latestOffsets,
    committedOffsets
  );
  if (!arePartitionsSame)
    throw new Error(
      "Latest offsets and committed offsets have different partitions"
    );

  return committedOffsets.map(({ partition, offset: committedOffset }) => {
    const latestOffset = latestOffsets[partition];
    return latestOffset
      ? { partition, latestOffset, lag: latestOffset - committedOffset }
      : null;
  });
};

module.exports = aggregateOffsetDetails;
