module.exports = `
  type ConsumerGroupMember {
    memberId: String!
    clientId: String!
    clientHost: String!
    memberMetadata: memberMetadata!
    memberAssignment: [memberAssignment]!
  }
`;
