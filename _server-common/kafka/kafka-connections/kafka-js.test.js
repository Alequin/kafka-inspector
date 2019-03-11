const mockDisconnect = jest.fn();

const mockAdminReturnValue = {
  events: {
    DISCONNECT: "DISCONNECT"
  },
  on: () => {},
  disconnect: mockDisconnect
};

const mockAdmin = jest.fn().mockImplementation(() => mockAdminReturnValue);

const mockClientReturnValue = function() {
  this.admin = mockAdmin;
};

const mockClient = jest.fn().mockImplementation(mockClientReturnValue);

jest.mock("kafkajs", () => {
  return {
    Kafka: mockClient
  };
});
const kafkaJs = require("./kafka-js");

const mockBroker = ["broker1:9092", "broker2:9092"];

describe("kafkaJs", () => {
  it("Creates both a kafkajs client and admin", () => {
    const testConnection = kafkaJs(mockBroker);
    testConnection();
    expect(mockClient).toBeCalledTimes(1);
    expect(mockAdmin).toBeCalledTimes(1);
  });

  it("Creates the kafkajs client with the given brokers", () => {
    const testConnection = kafkaJs(mockBroker);
    testConnection();
    expect(mockClient).toBeCalledWith({
      clientId: "k-inspect.kafkaJs",
      brokers: mockBroker
    });
  });

  it("Returns the kafka client and admin", () => {
    const testConnection = kafkaJs(mockBroker);

    const expected = {
      client: new mockClientReturnValue(),
      admin: mockAdminReturnValue
    };

    const actual = testConnection();

    expect(actual).toEqual(expected);
  });

  it("Sets connected to false and calls disconnect when close is called", () => {
    const testConnection = kafkaJs(mockBroker);
    const actual = testConnection();

    actual.admin.close();

    expect(mockDisconnect).toHaveBeenCalledTimes(1);
    expect(actual.admin.connected).toBe(false);
  });
});
