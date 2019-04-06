const mockAdmin = {
  disconnect: jest.fn()
};
const mockAdminFunc = jest.fn().mockReturnValue(mockAdmin);
const mockKafka = jest.fn().mockImplementation(function() {
  this.admin = mockAdminFunc;
});

jest.mock("kafkajs", () => {
  return {
    Kafka: mockKafka
  };
});

const mockKafkaConfigSettings = {
  kafkaBrokers: ["broker1:9092", "broker2:9092"]
};

const kafkaJsAdmin = require("./kafka-js-admin");

describe("kafkaJsAdmin", () => {
  beforeEach(() => {
    mockAdmin.disconnect.mockClear();
  });

  it("Calls the given callback, passing the admin as an argument", done => {
    kafkaJsAdmin(mockKafkaConfigSettings, admin => {
      expect(admin).toBe(mockAdmin);
      done();
    });
  });

  it("Returns the result of the callback, resolving any promises", async () => {
    const expected = {};
    const actual = await kafkaJsAdmin(
      mockKafkaConfigSettings,
      async () => expected
    );
    expect(actual).toBe(expected);
  });

  it("Disconnects the admin once the function has completed", async () => {
    await kafkaJsAdmin(mockKafkaConfigSettings, () => {});
    expect(mockAdmin.disconnect).toHaveBeenCalledTimes(1);
  });

  it("Disconnects the admin if the callback throws an error", async () => {
    const error = new Error("kafka js admin throw error");
    try {
      kafkaJsAdmin(mockKafkaConfigSettings, () => {
        throw error;
      });
    } catch (error) {
      expect(error).toBe(error);
      expect(mockAdmin.disconnect).toHaveBeenCalledTimes(1);
    }
  });

  it("Disconnects the admin if the callback rejects a promise", async () => {
    const error = new Error("kafka js admin reject error");
    kafkaJsAdmin(mockKafkaConfigSettings, async () => {
      throw error;
    }).catch(error => {
      expect(error).toBe(error);
      expect(mockAdmin.disconnect).toHaveBeenCalledTimes(1);
    });
  });
});
