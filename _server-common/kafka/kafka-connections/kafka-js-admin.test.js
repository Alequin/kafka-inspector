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

const mockKafkaConnectionConfig = {
  kafkaBrokers: ["broker1:9092", "broker2:9092"]
};

const kafkaJsAdmin = require("./kafka-js-admin");

describe("kafkaJsAdmin", () => {
  beforeEach(() => {
    mockAdmin.disconnect.mockClear();
  });

  it("Calls the given callback, passing the admin as an argument", done => {
    kafkaJsAdmin(mockKafkaConnectionConfig, admin => {
      expect(admin).toBe(mockAdmin);
      done();
    });
  });

  it("Disconnects the admin once the function has completed", async () => {
    await kafkaJsAdmin(mockKafkaConnectionConfig, () => {});
    expect(mockAdmin.disconnect).toHaveBeenCalledTimes(1);
  });
});
