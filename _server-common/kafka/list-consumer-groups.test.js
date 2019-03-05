jest.mock("./access-global-kafka-connections");
const mockListGroups = require("mock-test-data/kafka-node/mock-list-groups");
const accessGlobalKafkaConnections = require("./access-global-kafka-connections");
const listConsumerGroups = require("./list-consumer-groups");

describe("listConsumerGroups", () => {
  it("Should return a list of all consumer groups", async () => {
    accessGlobalKafkaConnections.mockReturnValue({
      kafkaNode: {
        admin: {
          listGroups: callback => {
            const error = false;
            callback(error, mockListGroups.response);
          }
        }
      }
    });

    const expected = [
      mockListGroups.consumerGroup1,
      mockListGroups.consumerGroup2,
      mockListGroups.consumerGroup3
    ];
    const consumerGroups = await listConsumerGroups();
    expect(consumerGroups).toEqual(expected);
  });

  it("Should throw an error if requesting the list of consumer groups fails", done => {
    const mockErrorMessage = "list consumer groups error message";
    accessGlobalKafkaConnections.mockReturnValue({
      kafkaNode: {
        admin: {
          listGroups: callback => {
            const error = mockErrorMessage;
            callback(error, mockListGroups.response);
          }
        }
      }
    });

    listConsumerGroups().catch(error => {
      expect(error).toBe(mockErrorMessage);
      done();
    });
  });
});
