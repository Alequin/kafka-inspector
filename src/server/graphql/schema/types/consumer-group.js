module.exports = `
  type ConsumerGroup {
    groupId: String!
    members: [ConsumerGroupMember!]!
    state: String!
    protocolType: String!
    protocol: String!
    brokerId: String!
  }
`;
