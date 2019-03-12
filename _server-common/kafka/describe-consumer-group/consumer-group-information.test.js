const mockConsumerGroups = require("mock-test-data/data/mock-consumer-groups");
const mockDescribeGroups = require("mock-test-data/kafka-node/mock-describe-groups");
jest.mock("../access-global-kafka-connections");
const mockAccessGlobalKafkaConnectionsImp = require("mock-test-data/mock-access-global-kafka-connections");
const accessGlobalKafkaConnections = require("../access-global-kafka-connections");
const consumerGroupInformation = require("./consumer-group-information");

describe("consumerGroupInformation", () => {
  let mockDescribeGroupsFunction = null;

  beforeEach(() => {
    const mockKafkaConnections = mockAccessGlobalKafkaConnectionsImp();
    mockDescribeGroupsFunction =
      mockKafkaConnections.kafkaNode.admin.describeGroups;
    accessGlobalKafkaConnections.mockReturnValue(mockKafkaConnections);
  });

  it("Should resolve the consumer groups information", async () => {
    const expected = mockDescribeGroups.response;
    const actual = await consumerGroupInformation([
      mockConsumerGroups.consumerGroup1
    ]);

    expect(actual).toEqual(expected);
  });

  it("Should call describeGroups with given consumerGroupName", async () => {
    await consumerGroupInformation([mockConsumerGroups.consumerGroup1]);
    expect(mockDescribeGroupsFunction.mock.calls[0][0]).toEqual([
      mockConsumerGroups.consumerGroup1
    ]);
  });

  it("Should reject if there is an error", done => {
    const mockError = "fetch group information error message";
    accessGlobalKafkaConnections.mockReturnValue(
      mockAccessGlobalKafkaConnectionsImp([
        {
          path: "kafkaNode.admin.describeGroups",
          override: (_groupNames, callback) => {
            const error = mockError;
            callback(error, null);
          }
        }
      ])
    );

    consumerGroupInformation(["groupName"]).catch(error => {
      expect(error).toBe(mockError);
      done();
    });
  });
});
