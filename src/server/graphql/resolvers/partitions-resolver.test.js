const partitionsResolver = require("./partitions-resolver");

describe("partitionsResolver", () => {
  const mockPartitions = [
    { partition: 0, isr: [3, 2, 1], replicas: [1, 2, 3], leader: 1 },
    { partition: 1, isr: [3, 2, 1], replicas: [1, 2, 3], leader: 1 },
    { partition: 2, isr: [3, 2, 1], replicas: [1, 2, 3], leader: 1 }
  ];

  it("Transforms the given partitions into the expected gql shape", () => {
    const expected = [
      {
        partitionNumber: 0,
        leader: 1,
        replicas: [1, 2, 3],
        inSyncReplicas: [3, 2, 1]
      },
      {
        partitionNumber: 1,
        leader: 1,
        replicas: [1, 2, 3],
        inSyncReplicas: [3, 2, 1]
      },
      {
        partitionNumber: 2,
        leader: 1,
        replicas: [1, 2, 3],
        inSyncReplicas: [3, 2, 1]
      }
    ];

    const actual = partitionsResolver({ partitions: mockPartitions }, {});
    expect(actual).toEqual(expected);
  });

  it("Returns the requested partitions", () => {
    const expected = [
      {
        partitionNumber: 0,
        leader: 1,
        replicas: [1, 2, 3],
        inSyncReplicas: [3, 2, 1]
      },
      {
        partitionNumber: 2,
        leader: 1,
        replicas: [1, 2, 3],
        inSyncReplicas: [3, 2, 1]
      }
    ];

    const actual = partitionsResolver(
      { partitions: mockPartitions },
      { partitionNumbers: [0, 2] }
    );
    expect(actual).toEqual(expected);
  });

  it("Returns nothing if the requested partitions do not exist", () => {
    const expected = [];

    const actual = partitionsResolver(
      { partitions: mockPartitions },
      { partitionNumbers: [-1, 3] }
    );
    expect(actual).toEqual(expected);
  });
});
