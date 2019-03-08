jest.mock("server-common/kafka/list-topics-with-cache");
const listTopicsWithCache = require("server-common/kafka/list-topics-with-cache");
const topicsResolver = require("./topics-resolver");

describe("topicsResolver", () => {
  it("makes a request for the cached list of topics and returns the value unmodified", async () => {
    const mockReturnValue = [{}];
    listTopicsWithCache.mockResolvedValue(mockReturnValue);
    const actual = await topicsResolver();
    expect(listTopicsWithCache).toBeCalledTimes(1);
    expect(actual).toBe(mockReturnValue);
  });
});
