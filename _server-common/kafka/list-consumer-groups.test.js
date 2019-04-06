jest.mock("./kafka-connections/kafka-node-admin");
const kafkaNodeAdmin = require("./kafka-connections/kafka-node-admin");
const mockConsumerGroups = {
  consumerGroup1: "consumer",
  ["consumer-group-2"]: ""
};

const listConsumerGroups = require("./list-consumer-groups");

describe("listConsumerGroups", () => {
  it("Should resolve a list of all consumer groups", async () => {
    kafkaNodeAdmin.mockImplementation((_kafkaConfig, callback) => {
      const mockAdmin = {
        listGroups: callback => {
          const error = false;
          callback(error, mockConsumerGroups);
        }
      };

      return callback(mockAdmin);
    });

    const expected = ["consumerGroup1", "consumer-group-2"];
    const consumerGroups = await listConsumerGroups();
    expect(consumerGroups).toEqual(expected);
  });

  it("Should throw an error if requesting the list of consumer groups fails", done => {
    const mockErrorMessage = "list consumer groups error message";
    kafkaNodeAdmin.mockImplementation((_kafkaConfig, callback) => {
      const mockAdmin = {
        listGroups: callback => {
          const error = mockErrorMessage;
          callback(error, mockConsumerGroups);
        }
      };

      return callback(mockAdmin);
    });

    listConsumerGroups().catch(error => {
      expect(error).toBe(mockErrorMessage);
      done();
    });
  });
});
