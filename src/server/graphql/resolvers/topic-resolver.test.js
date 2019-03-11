jest.mock("server-common/kafka/access-global-kafka-connections");
jest.mock("server-common/kafka/topic");
const mockTopics = require("mock-test-data/data/mock-topics");
const mockAccessGlobalKafkaConnectionsImp = require("mock-test-data/mock-access-global-kafka-connections");
const accessGlobalKafkaConnections = require("server-common/kafka/access-global-kafka-connections");

const topic = require("server-common/kafka/topic");

topic.mockImplementation(jest.requireActual("server-common/kafka/topic"));

accessGlobalKafkaConnections.mockReturnValue(
  mockAccessGlobalKafkaConnectionsImp()
);

const topicResolver = require("./topic-resolver");

describe("topicsResolver", () => {
  it("Request details for one topic", async () => {
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

    const actual = await topicResolver(
      {},
      { topicName: mockTopics.topic1 },
      { kafkaBrokers: [] }
    );

    expect(topic).toBeCalledTimes(1);
    expect(actual).toEqual(expected);
  });
});
