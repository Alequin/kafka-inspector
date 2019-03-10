const { cloneDeep, isError } = require("lodash");
const mockTopics = require("mock-test-data/data/mock-topics");
const mockGetTopicMetadata = require("mock-test-data/kafkajs/mock-get-topic-metadata");
jest.mock("./access-global-kafka-connections");
const mockAccessGlobalKafkaConnectionsImp = require("mock-test-data/mock-access-global-kafka-connections");
const accessGlobalKafkaConnections = require("./access-global-kafka-connections");

accessGlobalKafkaConnections.mockReturnValue(
  mockAccessGlobalKafkaConnectionsImp()
);

const topic = require("./topic");

describe("topic", () => {
  it("Return details on the requested topic", async () => {
    accessGlobalKafkaConnections.mockReturnValue(
      mockAccessGlobalKafkaConnectionsImp()
    );

    const expected = {
      name: mockTopics.topic1,
      partitions: [
        {
          topic: mockTopics.topic1,
          partition: 0,
          leader: 1,
          replicas: [3, 1, 2],
          isr: [1, 3, 2]
        },
        {
          topic: mockTopics.topic1,
          partition: 1,
          leader: 1,
          replicas: [3, 1, 2],
          isr: [1, 3, 2]
        }
      ]
    };

    const actual = await topic(mockTopics.topic1);
    expect(actual).toEqual(expected);
  });

  it("Sorts the partitions by number ascending", async () => {
    accessGlobalKafkaConnections.mockReturnValue(
      mockAccessGlobalKafkaConnectionsImp([
        {
          path: "kafkaJs.admin.getTopicMetadata",
          override: async () => mockGetTopicMetadata.unorderedResponse
        }
      ])
    );

    const expected = {
      name: mockTopics.topic1,
      partitions: [
        {
          topic: mockTopics.topic1,
          partition: 0,
          leader: 1,
          replicas: [3, 1, 2],
          isr: [1, 3, 2]
        },
        {
          topic: mockTopics.topic1,
          partition: 1,
          leader: 1,
          replicas: [3, 1, 2],
          isr: [1, 3, 2]
        }
      ]
    };

    const actual = await topic(mockTopics.topic1);
    expect(actual).toEqual(expected);
  });

  it("Throws an error if any partitions have a failing error code", done => {
    accessGlobalKafkaConnections.mockReturnValue(
      mockAccessGlobalKafkaConnectionsImp([
        {
          path: "kafkaJs.admin.getTopicMetadata",
          override: async () => {
            const response = cloneDeep(mockGetTopicMetadata.response);
            response.topics[0].partitions[0].partitionErrorCode = 1;
            return response;
          }
        }
      ])
    );

    topic(mockTopics.topic1).catch(error => {
      expect(isError(error)).toBe(true);
      done();
    });
  });
});
