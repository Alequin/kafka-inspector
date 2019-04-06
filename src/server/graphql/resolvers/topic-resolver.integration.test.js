jest.mock("server-common/kafka/kafka-connections/kafka-js-admin");
const kafkaJsAdmin = require("server-common/kafka/kafka-connections/kafka-js-admin");
kafkaJsAdmin.mockImplementation(
  jest.requireActual("server-common/kafka/kafka-connections/kafka-js-admin")
);
const topicResolver = require("./topic-resolver");

describe("topicsResolver", () => {
  beforeEach(() => {
    kafkaJsAdmin.mockClear();
  });

  it("Requests details for one topic", async () => {
    const expected = {
      name: "topic1",
      partitions: [
        {
          topic: "topic1",
          partition: 0,
          leader: 1,
          replicas: [3, 1, 2],
          isr: [1, 3, 2],
          error: "Error Code: 5 - LEADER_NOT_AVAILABLE"
        },
        {
          topic: "topic1",
          partition: 1,
          leader: 1,
          replicas: [3, 1, 2],
          isr: [1, 3, 2],
          error: null
        }
      ]
    };

    const actual = await topicResolver(
      {},
      { topicName: "topic1" },
      {
        kafkaConnectionConfig: { kafkaBroker: ["brokerForTest1:9092"] }
      }
    );

    expect(actual).toEqual(expected);
  });

  it("Make use of cached results if they are available", async () => {
    await topicResolver(
      {},
      { topicName: "topic1" },
      {
        kafkaConnectionConfig: { kafkaBroker: ["brokerForTest2:9092"] }
      }
    );
    expect(kafkaJsAdmin).toBeCalledTimes(1);
    await topicResolver(
      {},
      { topicName: "topic1" },
      {
        kafkaConnectionConfig: { kafkaBroker: ["brokerForTest2:9092"] }
      }
    );
    expect(kafkaJsAdmin).toBeCalledTimes(1);
  });
});
