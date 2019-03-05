const mockDescribeGroups = require("mock-test-data/kafka-node/mock-describe-groups");
jest.mock("../access-kafka-connections");
const accessKafkaConnections = require("../access-kafka-connections");
const consumerGroupInformation = require("./consumer-group-information");

const mockDescribeGroupsImplementation = jest.fn();
accessKafkaConnections.mockReturnValue({
  kafkaNode: {
    admin: {
      describeGroups: mockDescribeGroupsImplementation
    }
  }
});

describe("consumerGroupInformation", () => {
  beforeEach(() => {
    mockDescribeGroupsImplementation.mockImplementation(
      async (_groupNames, callback) => {
        const error = false;
        callback(error, mockDescribeGroups.response);
      }
    );
  });

  it("Should resolve the consumer groups information", async () => {
    const expected = mockDescribeGroups.groupInformation;
    const actual = await consumerGroupInformation(
      mockDescribeGroups.consumerGroupName
    );
    expect(actual).toEqual(expected);
  });

  it("Should call describeGroups with given consumerGroupNames", async () => {
    const { consumerGroupName } = mockDescribeGroups;
    await consumerGroupInformation(consumerGroupName);
    expect(mockDescribeGroupsImplementation.mock.calls[0][0]).toEqual([
      consumerGroupName
    ]);
  });

  it("Should reject if there is an error", done => {
    const mockError = "fetch group information error message";
    mockDescribeGroupsImplementation.mockImplementation(
      async (_groupNames, callback) => {
        const error = mockError;
        callback(error, null);
      }
    );

    consumerGroupInformation("groupName").catch(error => {
      expect(error).toBe(mockError);
      done();
    });
  });
});
