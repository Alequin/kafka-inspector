const mockTopics = require("mock-test-data/data/mock-topics");
const mockListTopics = require("mock-test-data/kafka-node/mock-list-topics");

jest.mock("./access-global-kafka-connections");
const mockAccessGlobalKafkaConnectionsImp = require("mock-test-data/mock-access-global-kafka-connections");
const accessGlobalKafkaConnections = require("./access-global-kafka-connections");

const listTopics = require("./list-topics");

describe("topics", () => {
  it("Should return a list of all topics, filtering out private topics", async () => {
    accessGlobalKafkaConnections.mockReturnValue(
      mockAccessGlobalKafkaConnectionsImp()
    );

    const topics = await listTopics();
    const rawTopicObject = mockListTopics.metadata;
    expect(topics).toEqual([
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
    ]);
  });

  it("Should throw an error if requesting the list of topics fails", done => {
    const mockErrorMessage = "list topics error message";
    accessGlobalKafkaConnections.mockReturnValue(
      mockAccessGlobalKafkaConnectionsImp([
        {
          path: "kafkaNode.admin.listTopics",
          override: callback => {
            const error = mockErrorMessage;
            callback(error, null);
          }
        }
      ])
    );

    listTopics().catch(error => {
      expect(error).toBe(mockErrorMessage);
      done();
    });
  });
});
