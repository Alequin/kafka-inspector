const { identifyError, failure } = require("./error-codes");

describe("errorCodes", () => {
  describe("failure", () => {
    const SUCCESS_CODE = 0;

    it("Returns false when given the success code", () => {
      expect(failure(0)).toBe(false);
    });

    it("Returns true when given a value other than the success code", () => {
      expect(failure(-1)).toBe(true);
      expect(failure(1)).toBe(true);
      expect(failure(50)).toBe(true);
      expect(failure(9999999)).toBe(true);
    });
  });

  describe("identifyError", () => {
    it("Returns details on the given error code", () => {
      const successMock = {
        type: "NONE",
        code: 0,
        retriable: true,
        description: "It worked. Good for you!"
      };

      expect(identifyError(0)).toEqual(successMock);
    });

    it("Returns unknown error if code is -1", () => {
      const unknownMock = {
        type: "UNKNOWN",
        code: -1,
        retriable: false,
        description:
          "The server experienced an unexpected error when processing the request"
      };

      expect(identifyError(-1)).toEqual(unknownMock);
    });

    it("Returns unmatched error if code is not known", () => {
      const errorCode = 9999999;
      const unmatchedMock = {
        type: "INVALID_ERROR_CODE",
        code: NaN,
        retriable: false,
        description:
          "The provided error code is either invalid or unknown by this system. " +
          `To get details on your error code (${errorCode}) review all kafka error codes ` +
          "at https://kafka.apache.org/protocol.html#protocol_error_codes"
      };

      expect(identifyError(errorCode)).toEqual(unmatchedMock);
    });
  });
});
