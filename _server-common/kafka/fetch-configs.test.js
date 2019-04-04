const { isError } = require("lodash");
jest.mock("./access-global-kafka-connections");
const mockConfigEntry = require("mock-test-data/data/mock-config-entry");
const mockAccessGlobalKafkaConnectionsImp = require("mock-test-data/mock-access-global-kafka-connections");
const accessGlobalKafkaConnections = require("./access-global-kafka-connections");
const { topicConfig, RESOURCE_TYPES } = require("./fetch-configs");

const mockTopic = "topic-name";

describe.skip("fetchConfigs", () => {
  describe.skip("topicConfig", () => {
    let mockDescribeConfigs = null;

    beforeEach(() => {
      const mockKafkaConnections = mockAccessGlobalKafkaConnectionsImp();
      mockDescribeConfigs = mockKafkaConnections.kafkaJs.admin.describeConfigs;
      accessGlobalKafkaConnections.mockReturnValue(mockKafkaConnections);
    });

    it("Should call describeConfigs with requested topic", async () => {
      await topicConfig(mockTopic, { kafkaBroker: [] });

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
