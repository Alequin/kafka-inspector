const aggregateOffsetDetails = (latestOffsets, committedOffsets) => {
  return committedOffsets.map(({ partition, offset }) => {
    const latestOffset = latestOffsets[partition];
    return { partition, latestOffset, lag: latestOffset - offset };
  });
};

module.exports = aggregateOffsetDetails;
