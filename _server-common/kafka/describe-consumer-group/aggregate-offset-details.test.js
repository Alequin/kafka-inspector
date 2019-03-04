const aggregateOffsetDetails = require("./aggregate-offset-details");

describe("aggregateOffsetDetails", () => {
  const mockLatestOffsets = {
    "0": 10,
    "1": 20,
    "2": 30
  };

  const mockCommittedOffsets = [
    { partition: 0, offset: 4 },
    { partition: 1, offset: 9 },
    { partition: 2, offset: 14 }
  ];

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

  it("Should skip a partition if it is not available in the committed offsets", () => {
    const mockCommittedOffsets = [
      { partition: 0, offset: 4 },
      { partition: 2, offset: 14 }
    ];

    const expected = [
      { partition: 0, latestOffset: 10, lag: 6 },
      { partition: 2, latestOffset: 30, lag: 16 }
    ];

    const actual = aggregateOffsetDetails(
      mockLatestOffsets,
      mockCommittedOffsets
    );

    expect(actual).toEqual(expected);
  });
});
