const mockConsumerGroups = require("mock-test-data/data/mock-consumer-groups");
jest.mock("./access-global-kafka-connections");
const mockAccessGlobalKafkaConnectionsImp = require("mock-test-data/mock-access-global-kafka-connections");
const accessGlobalKafkaConnections = require("./access-global-kafka-connections");

const listConsumerGroups = require("./list-consumer-groups");

describe("listConsumerGroups", () => {
  it("Should return a list of all consumer groups", async () => {
    accessGlobalKafkaConnections.mockReturnValue(
      mockAccessGlobalKafkaConnectionsImp()
    );

    const expected = [
      mockConsumerGroups.consumerGroup1,
      mockConsumerGroups.consumerGroup2,
      mockConsumerGroups.consumerGroup3
    ];
    const consumerGroups = await listConsumerGroups();
    expect(consumerGroups).toEqual(expected);
  });

  it("Should throw an error if requesting the list of consumer groups fails", done => {
    const mockErrorMessage = "list consumer groups error message";
    accessGlobalKafkaConnections.mockReturnValue(
      mockAccessGlobalKafkaConnectionsImp([
        {
          path: "kafkaNode.admin.listGroups",
          override: callback => {
            const error = mockErrorMessage;
            callback(error, null);
          }
        }
      ])
    );

    listConsumerGroups().catch(error => {
      expect(error).toBe(mockErrorMessage);
      done();
    });
  });
});
