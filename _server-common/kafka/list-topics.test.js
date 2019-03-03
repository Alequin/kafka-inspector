jest.mock("./access-kafka-connections");
const mockListTopics = require("mock-test-data/kafka-node/mock-list-topics");
const accessKafkaConnections = require("./access-kafka-connections");
const listTopics = require("./list-topics");

describe("topics", () => {
  it("Should return a list of all topics, filtering out private topics", async () => {
    accessKafkaConnections.mockReturnValue({
      kafkaNode: {
        admin: {
          listTopics: callback => {
            const error = false;
            callback(error, mockListTopics.response);
          }
        }
      }
    });

    const topics = await listTopics();
    const rawTopicObject = mockListTopics.metadata;
    expect(topics).toEqual([
      {
        name: "topic1",
        partitions: [rawTopicObject.topic1[0], rawTopicObject.topic1[1]]
      },
      {
        name: mockListTopics.topic2,
        partitions: [
          rawTopicObject[mockListTopics.topic2][0],
          rawTopicObject[mockListTopics.topic2][1]
        ]
      }
    ]);
  });

  it("Should throw an error if requesting the list of topics fails", async () => {
    const mockErrorMessage = "list topics error message";
    accessKafkaConnections.mockReturnValue({
      kafkaNode: {
        admin: {
          listTopics: callback => {
            const error = mockErrorMessage;
            callback(error, mockListTopics.response);
          }
        }
      }
    });

    listTopics().catch(error => {
      expect(error).toBe(mockErrorMessage);
    });
  });
});
