const mockListTopics = require("mock-test-data/kafka-node/mock-list-topics");

jest.mock("../access-global-kafka-connections");
const mockAccessGlobalKafkaConnectionsImp = require("mock-test-data/mock-access-global-kafka-connections");
const accessGlobalKafkaConnections = require("../access-global-kafka-connections");

const fetchBrokerDetailsAndTopicNames = require("./fetch-broker-details-and-topics-names");

describe("fetchBrokerDetailsAndTopicNames", () => {
  it("Should resolve the response from listTopics", async () => {
    accessGlobalKafkaConnections.mockReturnValue(
      mockAccessGlobalKafkaConnectionsImp()
    );

    const expected = mockListTopics.response;
    const actual = await fetchBrokerDetailsAndTopicNames();
    expect(actual).toBe(expected);
  });

  it("Should throw an error if listTopics fails", done => {
    const mockErrorMessage = "list topics error message";
    accessGlobalKafkaConnections.mockReturnValue(
      mockAccessGlobalKafkaConnectionsImp([
        {
          path: "kafkaNode.admin.listTopics",
          override: callback => {
            const error = mockErrorMessage;
            callback(error, null);
          }
        }
      ])
    );

    fetchBrokerDetailsAndTopicNames().catch(error => {
      expect(error).toBe(mockErrorMessage);
      done();
    });
  });
});
