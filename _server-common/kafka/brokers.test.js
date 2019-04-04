const mockBrokers = require("mock-test-data/data/mock-brokers");

jest.mock("./access-global-kafka-connections");
const mockAccessGlobalKafkaConnectionsImp = require("mock-test-data/mock-access-global-kafka-connections");
const accessGlobalKafkaConnections = require("./access-global-kafka-connections");

const brokers = require("./brokers");

describe.skip("brokers", () => {
  it("Should return a list of all brokers and the id of the current controller", async () => {
    accessGlobalKafkaConnections.mockReturnValue(
      mockAccessGlobalKafkaConnectionsImp()
    );

    const toExpectedBrokerObjShape = obj => ({
      ...obj,
      id: obj.nodeId,
      isController: obj.nodeId === 2
    });

    const actual = await brokers({ kafkaBrokers: [mockBrokers["1"].host] });
    expect(actual).toEqual([
      toExpectedBrokerObjShape(mockBrokers["1"]),
      toExpectedBrokerObjShape(mockBrokers["2"]),
      toExpectedBrokerObjShape(mockBrokers["3"])
    ]);
  });
});
