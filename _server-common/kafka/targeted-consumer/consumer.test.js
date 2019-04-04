jest.mock("../access-global-kafka-connections");
const mockAccessGlobalKafkaConnectionsImp = require("mock-test-data/mock-access-global-kafka-connections");
const accessGlobalKafkaConnections = require("../access-global-kafka-connections");

const mockReturnValue = {};
const mockNewConsumer = jest.fn().mockImplementation(() => mockReturnValue);

accessGlobalKafkaConnections.mockReturnValue(
  mockAccessGlobalKafkaConnectionsImp([
    { path: "kafkaNode.consumer", override: mockNewConsumer }
  ])
);

const consumer = require("./consumer");

describe.skip("consumer", () => {
  it("Returns a kafkaNode consumer", () => {
    const toConsumerFrom = {};
    const actual = consumer(toConsumerFrom, {});

    expect(mockNewConsumer.mock.calls[0][0]).toBe(toConsumerFrom);
    expect(actual).toBe(mockReturnValue);
  });
});
