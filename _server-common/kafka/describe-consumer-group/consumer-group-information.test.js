const mockDescribeGroups = require("mock-test-data/kafka-node/mock-describe-groups");
jest.mock("../access-kafka-connections");
const accessKafkaConnections = require("../access-kafka-connections");
const consumerGroupInformation = require("./consumer-group-information");

describe("consumerGroupInformation", () => {
  it("Should resolve the consumer groups information", async () => {
    accessKafkaConnections.mockReturnValue({
      kafkaNode: {
        admin: {
          describeGroups: (_groupNames, callback) => {
            const error = false;
            callback(error, mockDescribeGroups.response);
          }
        }
      }
    });
    const expected = mockDescribeGroups.groupInformation;
    const actual = await consumerGroupInformation(
      mockDescribeGroups.consumerGroupName
    );
    expect(actual).toEqual(expected);
  });

  it("Should reject if there is an error", done => {
    const mockError = "fetch group information error message";
    accessKafkaConnections.mockReturnValue({
      kafkaNode: {
        admin: {
          describeGroups: (_groupNames, callback) => {
            const error = mockError;
            callback(error, null);
          }
        }
      }
    });

    consumerGroupInformation("groupName").catch(error => {
      expect(error).toBe(mockError);
      done();
    });
  });
});
