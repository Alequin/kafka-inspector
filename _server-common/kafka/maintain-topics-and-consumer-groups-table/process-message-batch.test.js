const { cloneDeep } = require("lodash");
const mockTopics = require("mock-test-data/data/mock-topics");
const mockConsumerGroups = require("mock-test-data/data/mock-consumer-groups");
const BAD_CHARACTER = String.fromCharCode(1);
const processMessageBatch = require("./process-message-batch");

describe("processMessageBatch", () => {
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

  it("Can take in a message and transform it into a Topic / Consumer Group pair ", () => {
    const mockBatch = {
      messages: [mockMessage]
    };

    const expected = [
      {
        topicName: mockTopics.topic1,
        consumerGroup: {
          name: mockConsumerGroups.consumerGroup1,
          lastActive: timeNow
        }
      }
    ];
    const actual = processMessageBatch(mockBatch);
    expect(actual).toEqual(expected);
  });

  it("Removes all messages that do not produce a Topic / Consumer Group pair", () => {
    const mockBatch = {
      messages: [
        {
          key: Buffer.from(
            `${BAD_CHARACTER}${mockTopics.topic1}${BAD_CHARACTER} `
          ),
          timestamp: timeNow
        }
      ]
    };

    const expected = [];
    const actual = processMessageBatch(mockBatch);
    expect(actual).toEqual(expected);
  });

  it("Removes any duplicate Topic / Consumer Group pairs", () => {
    const mockBatch = {
      messages: [mockMessage, mockMessage]
    };

    const expected = [
      {
        topicName: mockTopics.topic1,
        consumerGroup: {
          name: mockConsumerGroups.consumerGroup1,
          lastActive: timeNow
        }
      }
    ];
    const actual = processMessageBatch(mockBatch);
    expect(actual).toEqual(expected);
  });

  it("Keeps the most recent duplicate when deciding between matching pairs", () => {
    const newTime = Date.now();
    const mockMessage2 = cloneDeep(mockMessage);

    mockMessage2.timestamp = newTime;
    const mockBatch = {
      messages: [mockMessage, mockMessage2]
    };

    const expected = [
      {
        topicName: mockTopics.topic1,
        consumerGroup: {
          name: mockConsumerGroups.consumerGroup1,
          lastActive: newTime
        }
      }
    ];
    const actual = processMessageBatch(mockBatch);
    expect(actual).toEqual(expected);
  });
});
