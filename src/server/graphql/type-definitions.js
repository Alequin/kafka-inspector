const requireFromSchema = file => name => {
  return require(`./schema/${file}/${name}`);
};

const type = requireFromSchema("types");
const gqlEnum = requireFromSchema("enums");
const input = requireFromSchema("inputs");

const typeDefs = `
  ${gqlEnum("comparator")}
  ${gqlEnum("encoding")}

  ${input("condition")}
  ${input("consumer-conditions")}

  ${type("member-assignment")}
  ${type("member-metadata")}
  ${type("consumer-group-member")}
  ${type("consumer-group")}
  ${type("partition")}
  ${type("partition-metadata")}
  ${type("config")}
  ${type("conditional-consumer-results")}
  ${type("message")}
  ${type("topic")}
  ${type("broker")}
  ${type("cluster")}

  type Query {
    cluster(kafkaBrokers: [String!]!): Cluster
  }

  type Subscription {
    latestOffsetConsumer(
      kafkaBrokers: [String!]!
      topicName: String!
    ): [Message!]!
  }
`;

module.exports = typeDefs;
