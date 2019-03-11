jest.mock("tcp-ping", () => {
  return {
    probe: jest.fn()
  };
});

const mockConstuctorFor = id => {
  return function() {
    this.id = id;
  };
};

const mockKafkaNodeClientConstructor = mockConstuctorFor("NodeClient");
const mockKafkaNodeAdminConstructor = mockConstuctorFor("Admin");
const mockOffsetConstructor = mockConstuctorFor("Offset");
const mockConsumerConstructor = mockConstuctorFor("Consumer");
const mockConsumerGroupStreamConstructor = mockConstuctorFor(
  "ConsumerGroupStream"
);
jest.mock("kafka-node", () => {
  return {
    KafkaClient: mockKafkaNodeClientConstructor,
    Admin: mockKafkaNodeAdminConstructor,
    Offset: mockOffsetConstructor,
    Consumer: mockConsumerConstructor,
    ConsumerGroupStream: mockConsumerGroupStreamConstructor
  };
});

const mockKafkaJsAdminFunction = jest.fn().mockImplementation(() => {
  return {
    on: jest.fn(),
    events: { DISCONNECTED: "DISCONNECTED" },
    connected: true
  };
});

const mockKafkaJsClientConstructor = jest.fn().mockImplementation(function() {
  this.admin = mockKafkaJsAdminFunction;
});

jest.mock("kafkajs", () => {
  return {
    Kafka: mockKafkaJsClientConstructor
  };
});

const newClusterConnection = require("./new-cluster-connection");

describe("newClusterConnection", () => {
  it("Should open new connections to kafka", () => {
    const actual = newClusterConnection(["broker1:9092"]);

    expect(actual.kafkaNode).toHaveProperty(
      "client",
      new mockKafkaNodeClientConstructor()
    );

    expect(actual.kafkaNode).toHaveProperty(
      "admin",
      new mockKafkaNodeAdminConstructor()
    );

    expect(actual.kafkaNode).toHaveProperty(
      "offset",
      new mockOffsetConstructor()
    );

    expect(actual.kafkaJs).toHaveProperty(
      "client",
      new mockKafkaJsClientConstructor()
    );

    // Kafka js admin gets some custom functionality
    const expectedKafkaJsAdmin = mockKafkaJsAdminFunction();
    expectedKafkaJsAdmin.connected = true;
    expectedKafkaJsAdmin.close = () => {};
    expect(JSON.stringify(actual.kafkaJs.admin)).toBe(
      JSON.stringify(expectedKafkaJsAdmin)
    );
  });
});
