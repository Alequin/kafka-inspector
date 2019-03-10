jest.mock("server-common/kafka/access-global-kafka-connections");
jest.mock("server-common/kafka/list-topics-with-cache");
const mockTopics = require("mock-test-data/data/mock-topics");
const mockListTopics = require("mock-test-data/kafka-node/mock-list-topics");
const mockAccessGlobalKafkaConnectionsImp = require("mock-test-data/mock-access-global-kafka-connections");
const accessGlobalKafkaConnections = require("server-common/kafka/access-global-kafka-connections");

const listTopicsWithCache = require("server-common/kafka/list-topics-with-cache");

listTopicsWithCache.mockImplementation(
  jest.requireActual("server-common/kafka/list-topics-with-cache")
);

accessGlobalKafkaConnections.mockReturnValue(
  mockAccessGlobalKafkaConnectionsImp()
);

const topicsResolver = require("./topics-resolver");

describe("topicsResolver", () => {
  it("makes a request for the cached list of topics and returns the value unmodified", async () => {
    const rawTopicObject = mockListTopics.metadata;
    const expected = [
      {
        name: mockTopics.topic1,
        partitions: [
          rawTopicObject[mockTopics.topic1][0],
          rawTopicObject[mockTopics.topic1][1]
        ]
      },
      {
        name: mockTopics.topic2,
        partitions: [
          rawTopicObject[mockTopics.topic2][0],
          rawTopicObject[mockTopics.topic2][1]
        ]
      }
    ];

    const actual = await topicsResolver();

    expect(listTopicsWithCache).toBeCalledTimes(1);
    expect(actual).toEqual(expected);
  });
});
