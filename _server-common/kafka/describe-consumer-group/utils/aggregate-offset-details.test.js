const aggregateOffsetDetails = require("./aggregate-offset-details");

describe("aggregateOffsetDetails", () => {
  const mockLatestOffsets = {
    "0": 10,
    "1": 20,
    "2": 30
  };
  const mockCommittedOffsets = [
    { partition: 0, committedOffset: 4 },
    { partition: 1, committedOffset: 9 },
    { partition: 2, committedOffset: 14 }
  ];

  it("Should find latest offset and calculate the message lag", () => {
    const expected = [
      { partitionNumber: 0, latestOffset: 10, committedOffset: 4, lag: 6 },
      { partitionNumber: 1, latestOffset: 20, committedOffset: 9, lag: 11 },
      { partitionNumber: 2, latestOffset: 30, committedOffset: 14, lag: 16 }
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
      { partition: 0, committedOffset: 4 },
      { partition: 2, committedOffset: 14 }
    ];

    expect(() =>
      aggregateOffsetDetails(mockLatestOffsets, mockCommittedOffsets)
    ).toThrow();
  });
});
