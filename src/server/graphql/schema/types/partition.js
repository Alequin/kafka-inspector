module.exports = `
  type Partition {
    partitionNumber: Int!
    metadata: PartitionMetadata!
    latestOffset: Int!
  }
`;
