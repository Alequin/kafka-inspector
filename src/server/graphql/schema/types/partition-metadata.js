module.exports = `
  type PartitionMetadata {
    leader: Int!
    replicas: [Int!]!
    inSyncReplicas: [Int!]!
  }
`;
