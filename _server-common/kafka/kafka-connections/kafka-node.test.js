const mockConstuctorFor = id => {
  return function() {
    this.id = id;
  };
};

const clientOptions = {};
const mockClientConstructor = function() {
  this.id = "client";
  this.options = clientOptions;
};
const mockClient = jest.fn().mockImplementation(mockClientConstructor);

const mockAdminConstructor = mockConstuctorFor("admin");
const mockAdmin = jest.fn().mockImplementation(mockAdminConstructor);

const mockOffsetConstructor = mockConstuctorFor("offset");
const mockOffset = jest.fn().mockImplementation(mockOffsetConstructor);

const mockConsumerConstructor = mockConstuctorFor("consumer");
const mockConsumer = jest.fn().mockImplementation(mockConsumerConstructor);

const mockConsumerGroupStreamConstructor = mockConstuctorFor(
  "consumerGroupStream"
);
const mockConsumerGroupStream = jest
  .fn()
  .mockImplementation(mockConsumerGroupStreamConstructor);

jest.mock("kafka-node", () => {
  return {
    KafkaClient: mockClient,
    Admin: mockAdmin,
    Offset: mockOffset,
    Consumer: mockConsumer,
    ConsumerGroupStream: mockConsumerGroupStream
  };
});

const kafkaNode = require("./kafka-node");

describe("kafkaNode", () => {
  it("Initialises the client with the given brokers", () => {
    const mockBroker = ["broker1", "broker2"];
    const testConnection = kafkaNode(mockBroker);
    testConnection();
    expect(mockClient).toHaveBeenCalledWith({
      kafkaHost: mockBroker.join(",")
    });
  });

  it("Initialises admin", () => {
    const mockBroker = ["broker1", "broker2"];
    const testConnection = kafkaNode(mockBroker);
    testConnection();
    expect(mockAdmin).toHaveBeenCalledWith(new mockClientConstructor());
  });

  it("Initialises offset", () => {
    const mockBroker = ["broker1", "broker2"];
    const testConnection = kafkaNode(mockBroker);
    testConnection();
    expect(mockOffset).toHaveBeenCalledWith(new mockClientConstructor());
  });

  it("Returns the client, admin and offset connections", () => {
    const mockBroker = ["broker1", "broker2"];
    const testConnection = kafkaNode(mockBroker);

    const expected = {
      client: new mockClientConstructor(),
      admin: new mockAdminConstructor(),
      offset: new mockOffsetConstructor()
    };

    const actual = testConnection();

    expect(actual).toHaveProperty("client", expected.client);
    expect(actual).toHaveProperty("admin", expected.admin);
    expect(actual).toHaveProperty("offset", expected.offset);
  });

  it("Returns a function which calls the consumer constructor", () => {
    const mockBroker = ["broker1", "broker2"];
    const testConnection = kafkaNode(mockBroker);

    const mockTopic = "topic";
    const mockOptions = {};

    const actual = testConnection();
    actual.consumer(mockTopic, mockOptions);

    expect(mockConsumer).toHaveBeenCalledWith(
      new mockClientConstructor(),
      mockTopic,
      mockOptions
    );
  });

  it("Returns a function which calls the consumerGroupStream constructor", () => {
    const mockBroker = ["broker1", "broker2"];
    const testConnection = kafkaNode(mockBroker);

    const mockOptions = { topicNames: ["topic"] };

    const actual = testConnection();
    actual.consumerGroupStream(mockOptions);

    expect(mockConsumerGroupStream).toHaveBeenCalledWith(
      {
        ...new mockClientConstructor().options,
        ...mockOptions
      },
      mockOptions.topicNames
    );
  });
});
