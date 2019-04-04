const mockBrokers = {
  "1": { nodeId: 1, host: "broker1", port: 9092 },
  "2": { nodeId: 2, host: "broker2", port: 9092 },
  "3": { nodeId: 3, host: "broker3", port: 9092 }
};
const metadata = {};

const listTopicsResponse = [
  mockBrokers,
  { metadata, clusterMetadata: { controllerId: 2 } }
];

jest.mock("./utils/fetch-broker-details-and-topics-names");
const fetchBrokerDetailsAndTopicNames = require("./utils/fetch-broker-details-and-topics-names");
fetchBrokerDetailsAndTopicNames.mockResolvedValue(listTopicsResponse);

const brokers = require("./brokers");

describe("brokers", () => {
  it("Should return a list of all brokers and identify the current controller", async () => {
    const expected = [
      {
        id: 1,
        host: "broker1",
        port: 9092,
        isController: false
      },
      {
        id: 2,
        host: "broker2",
        port: 9092,
        isController: true
      },
      {
        id: 3,
        host: "broker3",
        port: 9092,
        isController: false
      }
    ];

    const actual = await brokers({ kafkaBrokers: ["broker1:9092"] });
    expect(actual).toEqual(expected);
  });
});
