const handleKafkaConnectionCallback = require("./handle-kafka-connection-callback");

const mockCloseFunction = jest.fn();

describe("kafkaNodeAdmin", () => {
  beforeEach(() => {
    mockCloseFunction.mockClear();
  });

  it("Calls the callback with the connection given", async () => {
    const mockConnection = {};
    await handleKafkaConnectionCallback(
      mockConnection,
      mockCloseFunction,
      connection => {
        expect(connection).toBe(mockConnection);
      }
    );
  });

  it("Returns the result of the callback, resolving any promises", async () => {
    const mockConnection = {};
    const expected = {};
    const actual = await handleKafkaConnectionCallback(
      mockConnection,
      mockCloseFunction,
      _connection => Promise.resolve(expected)
    );
    expect(actual).toBe(expected);
  });

  it("Calls the close connection function once it resolves", async () => {
    const mockConnection = {};
    await handleKafkaConnectionCallback(
      mockConnection,
      mockCloseFunction,
      _connection => {}
    );
    expect(mockCloseFunction).toHaveBeenCalledTimes(1);
  });

  it("Closes the Kafka client if the callback throws an error", async () => {
    const mockConnection = {};
    try {
      await handleKafkaConnectionCallback(
        mockConnection,
        mockCloseFunction,
        _connection => {
          throw new Error();
        }
      );
    } catch {
      expect(mockCloseFunction).toHaveBeenCalledTimes(1);
    }
  });

  it("Closes the Kafka client if the callback rejects a promise", async () => {
    const mockConnection = {};
    await handleKafkaConnectionCallback(
      mockConnection,
      mockCloseFunction,
      async _connection => {
        throw new Error();
      }
    ).catch(() => {
      expect(mockCloseFunction).toHaveBeenCalledTimes(1);
    });
  });

  it("If the callback calls the close function it will not be called again when the handler finishes", async () => {
    const mockConnection = {};
    await handleKafkaConnectionCallback(
      mockConnection,
      mockCloseFunction,
      async (_connection, closeConnection) => {
        closeConnection();
      }
    );
    expect(mockCloseFunction).toHaveBeenCalledTimes(1);
  });

  it("Allows the callback to finish when it is a promise before closing", async () => {
    const mockConnection = {};
    await handleKafkaConnectionCallback(
      mockConnection,
      mockCloseFunction,
      async () =>
        new Promise(resolve => {
          setTimeout(() => {
            expect(mockCloseFunction).not.toBeCalled();
            resolve();
          }, 200);
        })
    );
  });
});
