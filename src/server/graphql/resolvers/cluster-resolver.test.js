const clusterResolver = require("./cluster-resolver");

describe("clusterResolver", () => {
  it("Should set the given kafkaBrokers in the context", () => {
    const args = {
      kafkaBrokers: ["broker1:9092", "broker2:9092", "broker3:9092"]
    };

    const context = {};
    clusterResolver({}, args, context);

    const expectedContext = {
      kafkaConnectionConfig: {
        kafkaBrokers: args.kafkaBrokers
      }
    };

    expect(context).toEqual(expectedContext);
  });

  it("Once set the kafka connection config should be unmodifiable", () => {
    const args = {
      kafkaBrokers: ["broker1:9092", "broker2:9092", "broker3:9092"]
    };
    const context = {};
    clusterResolver({}, args, context);

    expect(() => {
      context.kafkaConnectionConfig.kafkaBrokers = "new value";
    }).toThrow();
  });

  it("Returns an empty object to allow the rest of the graphql resolvers to work", () => {
    const args = {
      kafkaBrokers: ["broker1:9092", "broker2:9092", "broker3:9092"]
    };
    const context = {};
    expect(clusterResolver({}, args, context)).toEqual({});
  });

  it("Throws an error if the broker format is bad", () => {
    const args = {
      kafkaBrokers: ["broker1:9092", "broker2:9092", "broker3"]
    };
    const context = {};
    expect(() => clusterResolver({}, args, context)).toThrow();
  });
});
