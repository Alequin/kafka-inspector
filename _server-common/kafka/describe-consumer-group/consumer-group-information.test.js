const { isError } = require("lodash");
jest.mock("../kafka-connections/kafka-node-admin");
const kafkaNodeAdmin = require("../kafka-connections/kafka-node-admin");

const mockDescribeGroups = jest.fn();

kafkaNodeAdmin.mockImplementation((_kafkaConfig, callback) => {
  const mockAdmin = {
    describeGroups: mockDescribeGroups
  };
  return callback(mockAdmin);
});

jest.mock("./transform-group-information");
const transformGroupInformation = require("./transform-group-information");

const consumerGroupInformation = require("./consumer-group-information");

describe("consumerGroupInformation", () => {
  beforeEach(() => {
    mockDescribeGroups.mockReset();
    transformGroupInformation.mockReset();
  });

  it("Uses kafkaNodeAdmin to access the kafka admin", async () => {
    mockDescribeGroups.mockImplementation((_groupNames, callback) =>
      callback()
    );
    await consumerGroupInformation(null, {
      kafkaBrokers: ["broker1:9092"]
    });
    expect(kafkaNodeAdmin).toBeCalledTimes(1);
  });

  it("Resolves the transformed consumer groups", async () => {
    mockDescribeGroups.mockImplementation((_groupNames, callback) =>
      callback()
    );
    transformGroupInformation.mockReturnValue("expected return value");

    const expected = "expected return value";
    const actual = await consumerGroupInformation(null, {
      kafkaBrokers: ["broker1:9092"]
    });
    expect(actual).toEqual(expected);
  });

  it("Should call describeGroups with given consumerGroupNames", done => {
    const consumerGroupNames = ["name1", "name2", "name3"];
    mockDescribeGroups.mockImplementation((groupNames, callback) => {
      expect(groupNames).toEqual(consumerGroupNames);
      done();
    });

    consumerGroupInformation(consumerGroupNames, {
      kafkaBrokers: ["broker1:9092"]
    });
  });

  it("Should reject if there is an error", done => {
    const error = new Error("consumer group information error");
    mockDescribeGroups.mockImplementation((_groupNames, callback) => {
      callback(error);
    });

    consumerGroupInformation(null, {
      kafkaBrokers: ["broker1:9092"]
    }).catch(error => {
      expect(isError(error)).toBe(true);
      done();
    });
  });
});
