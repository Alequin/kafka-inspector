const { isError } = require("lodash");
jest.mock("./access-kafka-connections");
const accessKafkaConnections = require("./access-kafka-connections");

const mockTopic = "topic1";
const mockConfigEntries = [];
const mockResponse = {
  resources: [
    { errorCode: 0, errorMessage: null, configEntries: mockConfigEntries }
  ]
};
const mockDescribeConfigs = jest.fn().mockResolvedValue(mockResponse);

accessKafkaConnections.mockReturnValue({
  kafkaJs: {
    admin: {
      describeConfigs: mockDescribeConfigs
    }
  }
});

const { topicConfig, RESOURCE_TYPES } = require("./fetch-configs");

describe("fetchConfigs", () => {
  describe("topicConfig", () => {
    it("Should call describeConfigs with requested topic", async () => {
      await topicConfig(mockTopic);

      expect(mockDescribeConfigs).toBeCalledWith({
        resources: [{ name: mockTopic, type: RESOURCE_TYPES.TOPIC }]
      });
    });

    it("Should destructure and return the requested topics config", async () => {
      const expected = mockConfigEntries;
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
