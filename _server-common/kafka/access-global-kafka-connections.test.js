jest.mock("./kafka-connections/new-cluster-connection");
const newClusterConnection = require("./kafka-connections/new-cluster-connection");
const mockKafkaConnectionObject = {
  kafkaNode: {},
  kafkaKs: {}
};
newClusterConnection.mockReturnValue(mockKafkaConnectionObject);

const accessGlobalKafkaConnections = require("./access-global-kafka-connections");

describe.skip("accessGlobalKafkaConnections", () => {
  beforeEach(() => {
    newClusterConnection.mockClear();
  });

  it("Makes a call to new-cluster-connection when new brokers is provided", () => {
    accessGlobalKafkaConnections({ kafkaBrokers: ["broker1:9092"] });
    expect(newClusterConnection).toHaveBeenCalledTimes(1);
  });

  it("Makes a only one call to new-cluster-connection when if called with the same brokers twice", () => {
    const mockKafkaConfig = { kafkaBrokers: ["broker2s:9092"] };
    accessGlobalKafkaConnections(mockKafkaConfig);
    accessGlobalKafkaConnections(mockKafkaConfig);
    expect(newClusterConnection).toHaveBeenCalledTimes(1);
  });

  it("Throws an error if no brokers are provided", () => {
    expect(() => accessGlobalKafkaConnections()).toThrow();
  });
});
