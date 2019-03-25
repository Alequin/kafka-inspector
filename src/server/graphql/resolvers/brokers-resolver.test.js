jest.mock("server-common/kafka/brokers");
const brokers = require("server-common/kafka/brokers");
const brokersResolver = require("./brokers-resolver");

describe("brokersResolver", () => {
  it("Makes a request for the broker list and returns the response unmodified", async () => {
    const mockReturnValue = "I should be returned";
    brokers.mockResolvedValue(mockReturnValue);
    const mockKafkaConnectionConfig = { kafkaBrokers: ["broker"] };
    const mockContext = { kafkaConnectionConfig: mockKafkaConnectionConfig };

    const actual = await brokersResolver({}, {}, mockContext);

    expect(brokers).toHaveBeenCalledTimes(1);
    expect(brokers).toHaveBeenCalledWith(mockKafkaConnectionConfig);
    expect(actual).toBe(mockReturnValue);
  });
});
