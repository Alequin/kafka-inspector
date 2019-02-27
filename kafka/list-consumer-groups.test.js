const listConsumerGroups = require("./list-consumer-groups");

const consumerGroup1 = "group1";
const consumerGroup2 = "group2";
const consumerGroup3 = "group3";

const mockResponse = {
  [consumerGroup1]: "consumer",
  [consumerGroup2]: "",
  [consumerGroup3]: "consumer"
};

describe("listConsumerGroups", () => {
  it("Should return a list of all consumer groups", async () => {
    const mockKafkaConnection = {
      kafkaNode: {
        admin: {
          listGroups: callback => {
            const error = false;
            callback(error, mockResponse);
          }
        }
      }
    };

    const expected = [consumerGroup1, consumerGroup2, consumerGroup3];
    const consumerGroups = await listConsumerGroups(mockKafkaConnection);
    expect(consumerGroups).toEqual(expected);
  });

  it("Should throw an error if requesting the list of consumer groups fails", async () => {
    const mockErrorMessage = "list consumer groups error message";
    const mockKafkaConnection = {
      kafkaNode: {
        admin: {
          listGroups: callback => {
            const error = mockErrorMessage;
            callback(error, mockResponse);
          }
        }
      }
    };

    listConsumerGroups(mockKafkaConnection).catch(error => {
      expect(error).toBe(mockErrorMessage);
    });
  });
});
