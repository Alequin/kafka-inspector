const isPromise = require("./is-promise");

describe("isPromise", () => {
  it("Returns true if the given object is thenable", () => {
    const case1 = new Promise(() => {});
    expect(isPromise(case1)).toBe(true);
    const case2 = { then: () => {} };
    expect(isPromise(case2)).toBe(true);
  });

  it("Returns false if the given object is not thenable", () => {
    expect(isPromise(null)).toBe(false);
    expect(isPromise({})).toBe(false);
  });
});
