const simpleCache = require("./simple-cache");
const { milliseconds, minutes } = require("server-common/time-to-milliseconds");

const mockRequestFunction = jest.fn();
describe("simpleCache", () => {
  const count = () => {
    let count = 1;
    return () => ({ num: count++ });
  };
  beforeEach(() => {
    mockRequestFunction.mockImplementation(count());
  });

  it("Should call the given function if cache is empty", () => {
    const requestFunctionWithCache = simpleCache(mockRequestFunction);

    const expected = { num: 1 };
    const actual = requestFunctionWithCache();
    expect(actual).toEqual(expected);
    expect(mockRequestFunction).toBeCalledTimes(1);
  });

  it("Should not call the given function if cache is available", () => {
    const requestFunctionWithCache = simpleCache(mockRequestFunction);

    // first call without cache
    const expected = requestFunctionWithCache();
    // Reset call count to zero
    mockRequestFunction.mockClear();

    // second call with cache
    const actual = requestFunctionWithCache();
    expect(actual).toEqual(expected);
    expect(mockRequestFunction).toBeCalledTimes(0);
  });

  it("Should call the given function if refreshCacheAfter time has elapsed", done => {
    const requestFunctionWithCache = simpleCache(mockRequestFunction, {
      refreshCacheAfter: milliseconds(100)
    });

    const expected = requestFunctionWithCache();

    setTimeout(async () => {
      const actual = requestFunctionWithCache();
      expect(actual).not.toEqual(expected);
      expect(mockRequestFunction).toBeCalledTimes(2);
      done();
    }, milliseconds(500));
  });

  it("Should only return cached values when all args match a previous call", () => {
    const requestFunctionWithCache = simpleCache(mockRequestFunction, {
      refreshCacheAfter: minutes(10)
    });

    const args1 = [1, 2, 3, 4, 5];
    const args2 = [6, 7, 8, 9, 0];

    const call1 = requestFunctionWithCache(...args1);
    const call2 = requestFunctionWithCache(...args2);

    expect(call1).not.toEqual(call2);
    expect(call1).toEqual(requestFunctionWithCache(...args1));
    expect(call2).toEqual(requestFunctionWithCache(...args2));
  });

  describe("When given function is not async", () => {
    it("Cached the response as expected", async () => {
      const returnValue = { a: "b" };
      const requestFunctionWithCache = simpleCache(() => returnValue, {
        refreshCacheAfter: minutes(10)
      });

      const expected = requestFunctionWithCache();
      expect(requestFunctionWithCache()).toEqual(expected);
    });

    it("Clones the cached value", async () => {
      const returnValue = { a: "b" };
      const requestFunctionWithCache = simpleCache(async () => returnValue, {
        refreshCacheAfter: minutes(10)
      });

      const expected = requestFunctionWithCache();
      expect(requestFunctionWithCache()).not.toBe(expected);
    });
  });

  describe("When given function is async", () => {
    it("Cached the response as expected", async () => {
      const returnValue = { a: "b" };
      const requestFunctionWithCache = simpleCache(async () => returnValue, {
        refreshCacheAfter: minutes(10)
      });

      const expected = await requestFunctionWithCache();
      expect(await requestFunctionWithCache()).toEqual(expected);
    });

    it("Clones the cached value", async () => {
      const returnValue = { a: "b" };
      const requestFunctionWithCache = simpleCache(async () => returnValue, {
        refreshCacheAfter: minutes(10)
      });

      const expected = await requestFunctionWithCache();
      expect(await requestFunctionWithCache()).not.toBe(expected);
    });
  });
});
