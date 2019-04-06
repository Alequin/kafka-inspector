const { isString } = require("lodash");
const { checkBrokerFormat, validateBrokerFormat } = require("./broker-format");

describe("brokerFormat", () => {
  describe("checkBrokerFormat", () => {
    it("Identifies an invalid broker if the port is missing", () => {
      const { isInvalid, message } = checkBrokerFormat("host:");
      expect(isInvalid).toBe(true);
      expect(isString(message)).toBe(true);
    });

    it("Identifies an invalid broker if the host is missing", () => {
      const { isInvalid, message } = checkBrokerFormat(":9092");
      expect(isInvalid).toBe(true);
      expect(isString(message)).toBe(true);
    });

    it("Identifies an valid broker", () => {
      const { isInvalid, message } = checkBrokerFormat("host:9092");
      expect(isInvalid).toBe(false);
      expect(message).toBeNull();
    });
  });

  describe("validateBrokerFormat", () => {
    it("Does not throw an error if the broker format is okay", () => {
      expect(() => validateBrokerFormat("host:9092")).not.toThrow();
    });
    it("Throws an error if the broker format is bad", () => {
      expect(() => validateBrokerFormat("host:")).toThrow();
    });
  });
});
