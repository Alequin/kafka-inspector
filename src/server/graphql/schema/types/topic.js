module.exports = `
  type Topic {
    name: String!
    partitions(partitionNumbers: [Int!]): [Partition!]!
    config: [Config!]!
  }
`;
