const { isError } = require("lodash");

jest.mock("./kafka-connections/kafka-js-admin");
const kafkaJsAdmin = require("./kafka-connections/kafka-js-admin");

const mockConfigEntry = [
  {
    configName: "compression.type",
    configValue: "producer",
    readOnly: false,
    isDefault: true,
    isSensitive: false
  }
];
const mockDescribeConfigs = jest.fn().mockResolvedValue({
  resources: [
    {
      errorCode: 0,
      errorMessage: null,
      configEntries: mockConfigEntry
    }
  ]
});
const mockAdmin = {
  describeConfigs: mockDescribeConfigs
};
kafkaJsAdmin.mockImplementation((_kafkaConnectionConfig, callback) => {
  return callback(mockAdmin);
});

const { topicConfig, RESOURCE_TYPES } = require("./fetch-configs");

const mockTopic = "topic-name";

describe("fetchConfigs", () => {
  describe("topicConfig", () => {
    it("Should call describeConfigs with requested topic", async () => {
      const mockTopic = "topic1";
      await topicConfig(mockTopic, { kafkaBroker: ["broker1:9092"] });

      expect(mockDescribeConfigs).toBeCalledWith({
        resources: [{ name: mockTopic, type: RESOURCE_TYPES.TOPIC }]
      });
    });

    it("Should destructure and return the requested topics config", async () => {
      const expected = mockConfigEntry;
      const actual = await topicConfig(mockTopic);
      expect(actual).toEqual(expected);
    });

    it("Should throw an error if an error code is returned", done => {
      mockDescribeConfigs.mockResolvedValue({
        resources: [{ errorCode: 1, errorMessage: "message" }]
      });

      topicConfig(mockTopic).catch(error => {
        expect(isError(error)).toBe(true);
        done();
      });
    });
  });
});
