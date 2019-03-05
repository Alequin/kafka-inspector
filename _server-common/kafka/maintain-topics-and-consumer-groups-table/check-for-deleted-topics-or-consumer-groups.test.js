jest.mock("../access-global-kafka-connections");
const accessGlobalKafkaConnections = require("../access-global-kafka-connections");
const mockListTopics = require("mock-test-data/kafka-node/mock-list-topics");
const mockListGroups = require("mock-test-data/kafka-node/mock-list-groups");
accessGlobalKafkaConnections.mockReturnValue({
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
const checkForDeletedTopicsOrConsumerGroups = require("./check-for-deleted-topics-or-consumer-groups");

describe("checkForDeletedTopicsOrConsumerGroups", () => {
  const deletedTopicName = "deleted-topic";
  const deletedConsumerGroups = "deleted-consumer-group";

  const mockTable = [
    {
      id: 1,
      topicName: mockListTopics.topic1,
      consumerGroupName: mockListGroups.consumerGroup1,
      lastActive: 123
    },
    {
      id: 2,
      topicName: mockListTopics.topic2,
      consumerGroupName: mockListGroups.consumerGroup2,
      lastActive: 234
    },
    {
      id: 3,
      topicName: deletedTopicName,
      consumerGroupName: deletedConsumerGroups,
      lastActive: 345
    }
  ];

  it("Should identify Topics which are in the table topicAndConsumerGroup which should be deleted", async () => {
    const expected = [deletedTopicName];
    const actual = await checkForDeletedTopicsOrConsumerGroups(mockTable);
    expect(actual.deletedTopicNames).toEqual(expected);
  });

  it("Should identify Consumer Groups which are in the table topicAndConsumerGroup which should be deleted", async () => {
    const expected = [deletedConsumerGroups];
    const actual = await checkForDeletedTopicsOrConsumerGroups(mockTable);
    expect(actual.deletedConsumerGroupNames).toEqual(expected);
  });

  it("Should not identify any topics or consumer groups for deletion if they all exist", async () => {
    const mockTable = [
      {
        id: 1,
        topicName: mockListTopics.topic1,
        consumerGroupName: mockListGroups.consumerGroup1,
        lastActive: 123
      },
      {
        id: 2,
        topicName: mockListTopics.topic2,
        consumerGroupName: mockListGroups.consumerGroup2,
        lastActive: 234
      }
    ];

    const expected = [];
    const actual = await checkForDeletedTopicsOrConsumerGroups(mockTable);
    expect(actual.deletedTopicNames).toEqual(expected);
    expect(actual.deletedConsumerGroupNames).toEqual(expected);
  });
});
