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
  ${type("partition-offsets")}
  ${type("offsets")}
  ${type("topic")}
  ${type("broker")}
  ${type("cluster")}
  ${type("stored-cluster")}

  type Query {
    storedClusters: [StoredCluster!]!
    cluster(kafkaBrokers: [String!]!): Cluster
  }

  type Mutation {
    addCluster(kafkaBrokers: [String!]!): String!
    deleteCluster(clusterRowId: ID!): String!
  }

  type Subscription {
    latestOffsetConsumer(
      kafkaBrokers: [String!]!
      topicName: String!
    ): [Message!]!
    conditionalConsumer(
      kafkaBrokers: [String!]!
      topicName: String!
      partitions: [Int!]
      minOffset: Int
      maxOffset: Int
      conditions: ConsumerConditions
    ): ConditionalConsumerResults!
  }
`;

module.exports = typeDefs;
