module.exports = `
  type Offsets {
    sumOfLatestOffsets: Int!
    sumOfCommittedOffsets: Int!
    sumOfLag: Int!
    partitions: [PartitionOffsets!]!
  }
`;
