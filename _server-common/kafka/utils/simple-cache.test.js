const simpleCache = require("./simple-cache");
const { milliseconds } = require("server-common/time-to-milliseconds");

describe.skip("simpleCache", () => {
  const mockResponse = {
    food: "Eggs"
  };

  const mockRequestFunction = jest.fn().mockReturnValue(mockResponse);

  beforeEach(() => {
    mockRequestFunction.mockClear();
  });

  it("Should call the given function if cache is empty", async () => {
    const requestFunctionWithCache = simpleCache(mockRequestFunction);

    const expected = mockResponse;
    const actual = await requestFunctionWithCache();
    expect(actual).toEqual(expected);
    expect(mockRequestFunction).toBeCalledTimes(1);
  });

  it("Should not call the given function if cache is available", async () => {
    const requestFunctionWithCache = simpleCache(mockRequestFunction);

    const expected = mockResponse;
    // first call without cache
    await requestFunctionWithCache();
    // Reset call count to zero
    mockRequestFunction.mockClear();

    // second call with cache
    const actual = await requestFunctionWithCache();
    expect(actual).toEqual(expected);
    expect(mockRequestFunction).toBeCalledTimes(0);
  });

  it("Should call the given function if refreshCacheAfter time has elapsed", done => {
    const requestFunctionWithCache = simpleCache(mockRequestFunction, {
      refreshCacheAfter: milliseconds(100)
    });

    const expected = mockResponse;
    requestFunctionWithCache();

    setTimeout(async () => {
      const actual = await requestFunctionWithCache();
      expect(actual).toEqual(expected);
      expect(mockRequestFunction).toBeCalledTimes(2);
      done();
    }, milliseconds(500));
  });
});
