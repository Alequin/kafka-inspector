jest.mock("../fetch-latest-offsets");
const fetchLatestOffsets = require("../fetch-latest-offsets");
fetchLatestOffsets.mockResolvedValue({
  "0": 10,
  "1": 20,
  "2": 30
});

jest.mock("./utils/fetch-committed-offsets");
const fetchCommittedOffsets = require("./utils/fetch-committed-offsets");
fetchCommittedOffsets.mockResolvedValue([
  { partition: 0, committedOffset: 4 },
  { partition: 1, committedOffset: 9 },
  { partition: 2, committedOffset: 14 }
]);

const consumerGroupOffsets = require("./consumer-group-offsets");

describe("consumerGroupOffsets", () => {
  it("Gathers and return a summary of offset details from the requested consumer group", async () => {
    const expected = {
      sumOfLatestOffsets: 60,
      sumOfCommittedOffsets: 27,
      sumOfLag: 33,
      partitions: [
        { partitionNumber: 0, latestOffset: 10, committedOffset: 4, lag: 6 },
        { partitionNumber: 1, latestOffset: 20, committedOffset: 9, lag: 11 },
        { partitionNumber: 2, latestOffset: 30, committedOffset: 14, lag: 16 }
      ]
    };
    const actual = await consumerGroupOffsets("topic1", "consumerGroup1");

    expect(actual).toEqual(expected);
  });
});
