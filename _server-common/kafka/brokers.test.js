const mockBrokers = require("mock-test-data/data/mock-brokers");

jest.mock("./access-global-kafka-connections");
const mockAccessGlobalKafkaConnectionsImp = require("mock-test-data/mock-access-global-kafka-connections");
const accessGlobalKafkaConnections = require("./access-global-kafka-connections");

const brokers = require("./brokers");

describe("brokers", () => {
  it("Should return a list of all brokers and the id of the current controller", async () => {
    accessGlobalKafkaConnections.mockReturnValue(
      mockAccessGlobalKafkaConnectionsImp()
    );

    const toExpectedBrokerObjShape = obj => ({
      ...obj,
      id: obj.nodeId
    });

    const actual = await brokers({ kafkaBrokers: [mockBrokers["1"].host] });
    expect(actual).toEqual({
      brokers: [
        toExpectedBrokerObjShape(mockBrokers["1"]),
        toExpectedBrokerObjShape(mockBrokers["2"]),
        toExpectedBrokerObjShape(mockBrokers["3"])
      ],
      controllerId: 2
    });
  });
});
