jest.mock("../access-global-kafka-connections");
const mockAccessGlobalKafkaConnectionsImp = require("mock-test-data/mock-access-global-kafka-connections");
const accessGlobalKafkaConnections = require("../access-global-kafka-connections");
const mockTopics = require("mock-test-data/data/mock-topics");
const mockConsumerGroups = require("mock-test-data/data/mock-consumer-groups");

const deletedTopicName = mockTopics.topic3;
const deletedConsumerGroupName = mockConsumerGroups.consumerGroup3;

accessGlobalKafkaConnections.mockReturnValue(
  mockAccessGlobalKafkaConnectionsImp()
);

const checkForDeletedTopicsOrConsumerGroups = require("./check-for-deleted-topics-or-consumer-groups");

describe("checkForDeletedTopicsOrConsumerGroups", () => {
  const mockTable = [
    {
      id: 1,
      topicName: mockTopics.topic1,
      consumerGroupName: mockConsumerGroups.consumerGroup1,
      lastActive: 234
    },
    {
      id: 2,
      topicName: mockTopics.topic2,
      consumerGroupName: mockConsumerGroups.consumerGroup2,
      lastActive: 234
    },
    {
      id: 3,
      topicName: deletedTopicName,
      consumerGroupName: deletedConsumerGroupName,
      lastActive: 345
    }
  ];

  it("Should identify Topics which are in the table topicAndConsumerGroup which should be deleted", async () => {
    const expected = [deletedTopicName];
    const actual = await checkForDeletedTopicsOrConsumerGroups(mockTable);
    expect(actual.deletedTopicNames).toEqual(expected);
  });

  it("Should identify Consumer Groups which are in the table topicAndConsumerGroup which should be deleted", async () => {
    const expected = [deletedConsumerGroupName];
    const actual = await checkForDeletedTopicsOrConsumerGroups(mockTable);
    expect(actual.deletedConsumerGroupNames).toEqual(expected);
  });

  it("Should not identify any topics or consumer groups for deletion if they all exist", async () => {
    const mockTable = [
      {
        id: 1,
        topicName: mockTopics.topic1,
        consumerGroupName: mockConsumerGroups.consumerGroup1,
        lastActive: 234
      },
      {
        id: 2,
        topicName: mockTopics.topic2,
        consumerGroupName: mockConsumerGroups.consumerGroup2,
        lastActive: 234
      }
    ];

    const expected = [];
    const actual = await checkForDeletedTopicsOrConsumerGroups(mockTable);
    expect(actual.deletedTopicNames).toEqual(expected);
    expect(actual.deletedConsumerGroupNames).toEqual(expected);
  });
});
