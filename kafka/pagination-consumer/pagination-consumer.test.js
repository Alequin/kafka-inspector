jest.mock("./single-consumer");
const singleConsumer = require("./single-consumer");
const paginationConsumer = require("./pagination-consumer");

describe("paginationConsumer", () => {
  const mockMessages = {
    [0]: { offset: 1 },
    [1]: { offset: 2 },
    [2]: { offset: 3 }
  };

  singleConsumer.mockImplementation(
    async ({ partition, _topic, _offsetRange }) => {
      return [mockMessages[partition]];
    }
  );

  it(`Should return messages from the requested partitions`, async () => {
    const expected = {
      [2]: [mockMessages[2]],
      [0]: [mockMessages[0]]
    };
    const actual = await paginationConsumer({
      topic: "mock-topic",
      partitions: [0, 2]
    });

    expect(actual).toEqual(expected);
  });
});
