module.exports = `
  type ConditionalConsumerResults {
    matchingMessagesCount: Int!
    rejectedMessagesCount: Int!
    messages: [Message!]!
  }
`;
