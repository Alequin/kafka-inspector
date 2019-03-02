jest.mock("./access-kafka-connections");
const mockListGroups = require("mock-test-data/kafka-node/mock-list-groups");
const accessKafkaConnections = require("./access-kafka-connections");
const listConsumerGroups = require("./list-consumer-groups");

describe("listConsumerGroups", () => {
  it("Should return a list of all consumer groups", async () => {
    accessKafkaConnections.mockReturnValue({
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

  it("Should throw an error if requesting the list of consumer groups fails", async () => {
    const mockErrorMessage = "list consumer groups error message";
    accessKafkaConnections.mockReturnValue({
      kafkaNode: {
        admin: {
          listGroups: callback => {
            const error = false;
            callback(error, mockListGroups.response);
          }
        }
      }
    });

    listConsumerGroups().catch(error => {
      expect(error).toBe(mockErrorMessage);
    });
  });
});
