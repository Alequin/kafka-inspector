const { isEqual } = require("lodash");

const aggregateOffsetDetails = (latestOffsets, committedOffsets) => {
  const arePartitionsSame = checkAllPartitionsMatch(
    latestOffsets,
    committedOffsets
  );
  if (!arePartitionsSame)
    throw new Error(
      "Latest offsets and committed offsets have different partitions"
    );

  return committedOffsets.map(({ partition, offset }) => {
    const latestOffset = latestOffsets[partition];
    return latestOffset
      ? { partition, latestOffset, lag: latestOffset - offset }
      : null;
  });
};

const checkAllPartitionsMatch = (latestOffsets, committedOffsets) => {
  const latestOffsetPartitions = Object.keys(latestOffsets);
  const committedOffsetsPartitions = committedOffsets.map(({ partition }) =>
    partition.toString()
  );
  return isEqual(latestOffsetPartitions, committedOffsetsPartitions);
};

module.exports = aggregateOffsetDetails;
