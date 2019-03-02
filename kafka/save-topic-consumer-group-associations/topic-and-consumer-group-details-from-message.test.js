jest.mock("../access-kafka-connections");
const accessKafkaConnections = require("../access-kafka-connections");
accessKafkaConnections.mockReturnValue({
  kafkaNode: {
    admin: {
      listTopics: callback => {
        const error = false;
        callback(error, mockListTopics.response);
      },
      listGroups: callback => {
        const error = false;
        callback(error, mockListGroups.response);
      }
    }
  }
});

const mockListTopics = require("mock-test-data/kafka-node/mock-list-topics");
const mockListGroups = require("mock-test-data/kafka-node/mock-list-groups");
const topicAndConsumerGroupDetailsFromMessage = require("./topic-and-consumer-group-details-from-message");

const BAD_CHARACTER = String.fromCharCode(1);

describe("topicAndConsumerGroupDetailsFromMessage", () => {
  it("Should correctly extract the topic and consumer group details", async () => {
    const timeNow = Date.now();

    // Key is received as a buffer.
    // When changed to a string it is in the form: "<groupName><topicName>"
    const mockMessage = {
      key: Buffer.from(
        ` ${BAD_CHARACTER}${mockListGroups.consumerGroup1}${BAD_CHARACTER}${
          mockListTopics.topic1
        }${BAD_CHARACTER} `
      ),
      timestamp: timeNow
    };

    const expected = {
      topicName: mockListTopics.topic1,
      consumerGroup: {
        name: mockListGroups.consumerGroup1,
        lastActive: timeNow
      }
    };

    const actual = await topicAndConsumerGroupDetailsFromMessage(mockMessage);
    expect(actual).toEqual(expected);
  });

  it("Should return null if the Topic Name does not match any names returned from 'listTopics'", async () => {
    const timeNow = Date.now();

    // Key is received as a buffer.
    // When changed to a string it is in the form: "<groupName><topicName>"
    const mockMessage = {
      key: Buffer.from(
        ` ${BAD_CHARACTER}${
          mockListGroups.consumerGroup1
        }${BAD_CHARACTER}badTopicName${BAD_CHARACTER} `
      ),
      timestamp: timeNow
    };

    const expected = null;
    const actual = await topicAndConsumerGroupDetailsFromMessage(mockMessage);
    expect(actual).toEqual(expected);
  });

  it("Should return null if the Consumer Group Name does not match any names returned from 'listConsumerGroups'", async () => {
    const timeNow = Date.now();

    // Key is received as a buffer.
    // When changed to a string it is in the form: "<groupName><topicName>"
    const mockMessage = {
      key: Buffer.from(
        ` ${BAD_CHARACTER}badConsumerGroupName${BAD_CHARACTER}${
          mockListTopics.topic1
        }${BAD_CHARACTER} `
      ),
      timestamp: timeNow
    };

    const expected = null;
    const actual = await topicAndConsumerGroupDetailsFromMessage(mockMessage);
    expect(actual).toEqual(expected);
  });

  it("Should return null if Topic Name is missing", async () => {
    const timeNow = Date.now();

    // Key is received as a buffer.
    // When changed to a string it is in the form: "<groupName><topicName>"
    const mockMessage = {
      key: Buffer.from(` ${BAD_CHARACTER}badConsumerGroupName${BAD_CHARACTER}`),
      timestamp: timeNow
    };

    const expected = null;
    const actual = await topicAndConsumerGroupDetailsFromMessage(mockMessage);
    expect(actual).toEqual(expected);
  });

  it("Should return null if Consumer Group Name is missing", async () => {
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
    const actual = await topicAndConsumerGroupDetailsFromMessage(mockMessage);
    expect(actual).toEqual(expected);
  });
});
