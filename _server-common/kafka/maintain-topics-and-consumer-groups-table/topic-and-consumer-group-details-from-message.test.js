jest.mock("../access-global-kafka-connections");
const mockTopics = require("mock-test-data/data/mock-topics");
const mockListTopics = require("mock-test-data/kafka-node/mock-list-topics");
const mockConsumerGroups = require("mock-test-data/data/mock-consumer-groups");
const mockAccessGlobalKafkaConnectionsImp = require("mock-test-data/mock-access-global-kafka-connections");
const accessGlobalKafkaConnections = require("../access-global-kafka-connections");
accessGlobalKafkaConnections.mockReturnValue(
  mockAccessGlobalKafkaConnectionsImp()
);

const topicAndConsumerGroupDetailsFromMessage = require("./topic-and-consumer-group-details-from-message");

const BAD_CHARACTER = String.fromCharCode(1);

describe("topicAndConsumerGroupDetailsFromMessage", () => {
  it("Should correctly extract the topic and consumer group details", () => {
    const timeNow = Date.now();

    // Key is received as a buffer.
    // When changed to a string it is in the form: "<groupName><topicName>"
    const mockMessage = {
      key: Buffer.from(
        ` ${BAD_CHARACTER}${mockConsumerGroups.consumerGroup1}${BAD_CHARACTER}${
          mockTopics.topic1
        }${BAD_CHARACTER} `
      ),
      timestamp: timeNow
    };

    const expected = {
      topicName: mockTopics.topic1,
      consumerGroup: {
        name: mockConsumerGroups.consumerGroup1,
        lastActive: timeNow
      }
    };

    const actual = topicAndConsumerGroupDetailsFromMessage(mockMessage);
    expect(actual).toEqual(expected);
  });

  it("Should return null if Topic Name is missing", () => {
    const timeNow = Date.now();

    // Key is received as a buffer.
    // When changed to a string it is in the form: "<groupName><topicName>"
    const mockMessage = {
      key: Buffer.from(` ${BAD_CHARACTER}badConsumerGroupName${BAD_CHARACTER}`),
      timestamp: timeNow
    };

    const expected = null;
    const actual = topicAndConsumerGroupDetailsFromMessage(mockMessage);
    expect(actual).toEqual(expected);
  });

  it("Should return null if Consumer Group Name is missing", () => {
    const timeNow = Date.now();

    // Key is received as a buffer.
    // When changed to a string it is in the form: "<groupName><topicName>"
    const mockMessage = {
      key: Buffer.from(
        `${BAD_CHARACTER}${mockListTopics.topic1}${BAD_CHARACTER} `
      ),
      timestamp: timeNow
    };

    const expected = null;
    const actual = topicAndConsumerGroupDetailsFromMessage(mockMessage);
    expect(actual).toEqual(expected);
  });
});
