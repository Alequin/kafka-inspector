const mockAdminReturnValue = {
  events: {
    DISCONNECT: "DISCONNECT"
  },
  on: () => {}
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

describe("kafkaJs", () => {
  it("Creates both a kafkajs client and admin", () => {
    const mockBroker = ["broker1", "broker2"];
    const testConnection = kafkaJs(mockBroker);
    testConnection();
    expect(mockClient).toBeCalledTimes(1);
    expect(mockAdmin).toBeCalledTimes(1);
  });

  it("Creates the kafkajs client with the given brokers", () => {
    const mockBroker = ["broker1", "broker2"];
    const testConnection = kafkaJs(mockBroker);
    testConnection();
    expect(mockClient).toBeCalledWith({
      clientId: "k-inspect.kafkaJs",
      brokers: mockBroker
    });
  });

  it("Returns the kafka client and admin", () => {
    const mockBroker = ["broker1", "broker2"];
    const testConnection = kafkaJs(mockBroker);

    const expected = {
      client: new mockClientReturnValue(),
      admin: mockAdminReturnValue
    };

    const actual = testConnection();

    expect(actual).toEqual(expected);
  });
});
