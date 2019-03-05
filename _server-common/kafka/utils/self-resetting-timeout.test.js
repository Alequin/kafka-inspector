const selfResettingTimeout = require("./self-resetting-timeout");

describe("selfResettingTimeout", () => {
  it("Should call the given function after the set period of time", done => {
    const timeout = selfResettingTimeout(100);
    const startTime = new Date();
    timeout(() => {
      const elapsedTime = new Date() - startTime;
      // Slight leniency as timeouts can be slightly off
      const actual = elapsedTime >= 98 && elapsedTime <= 102;
      expect(actual).toBe(true);
      done();
    });
  });
});
