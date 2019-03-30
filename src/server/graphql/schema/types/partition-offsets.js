module.exports = `
  type PartitionOffsets {
    latestOffset: Int!
    committedOffset: Int!
    lag: Int!
  }
`;
