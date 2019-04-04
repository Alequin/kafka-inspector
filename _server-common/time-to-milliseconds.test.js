const timeToMilliseconds = require("./time-to-milliseconds");

describe.skip("timeToMilliseconds", () => {
  describe.skip("milliseconds", () => {
    const { milliseconds } = timeToMilliseconds;
    it("should return the given number", () => {
      expect(milliseconds(1)).toBe(1);
    });
  });
  describe.skip("seconds", () => {
    const { seconds } = timeToMilliseconds;
    it("should return the given number", () => {
      expect(seconds(1)).toBe(1000);
    });
  });
  describe.skip("minutes", () => {
    const { minutes } = timeToMilliseconds;
    it("should return the given number", () => {
      expect(minutes(1)).toBe(60000);
    });
  });
});
