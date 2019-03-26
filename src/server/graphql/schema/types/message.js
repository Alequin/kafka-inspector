module.exports = `
  type Message {
    topic: String!
    partition: Int!
    offset: Int!
    key: String!
    value: String!
    highWaterOffset: Int!
  }
`;
