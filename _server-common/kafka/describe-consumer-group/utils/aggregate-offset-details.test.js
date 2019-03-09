const mockTopicOffsets = require("mock-test-data/data/mock-topic-offsets");
const mockFetchOffsets = require("mock-test-data/kafkajs/mock-fetch-offsets");

const aggregateOffsetDetails = require("./aggregate-offset-details");

describe("aggregateOffsetDetails", () => {
  const mockLatestOffsets = mockTopicOffsets;
  const mockCommittedOffsets = mockFetchOffsets.response;

  it("Should find latest offset and calculate the message lag", () => {
    const expected = [
      { partition: 0, latestOffset: 10, lag: 6 },
      { partition: 1, latestOffset: 20, lag: 11 },
      { partition: 2, latestOffset: 30, lag: 16 }
    ];

    const actual = aggregateOffsetDetails(
      mockLatestOffsets,
      mockCommittedOffsets
    );

    expect(actual).toEqual(expected);
  });

  it(`Should throw an error if the partitions known by the latest offsets 
  and those known by committed offsets do not match`, () => {
    const mockCommittedOffsets = [
      { partition: 0, offset: 4 },
      { partition: 2, offset: 14 }
    ];

    expect(() =>
      aggregateOffsetDetails(mockLatestOffsets, mockCommittedOffsets)
    ).toThrow();
  });
});
