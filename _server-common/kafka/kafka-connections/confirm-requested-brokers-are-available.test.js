const { isError } = require("lodash");
const mockProbe = jest.fn();
jest.mock("tcp-ping", () => {
  return {
    probe: mockProbe
  };
});

const confirmRequestedBrokersAreValid = require("./confirm-requested-brokers-are-available");

describe.skip("confirmRequestedBrokersAreValid", () => {
  beforeEach(() => {
    mockProbe.mockReset();
  });

  it("Calls probe for each given broker", () => {
    mockProbe.mockImplementation((_broker, _port, callback) => {
      const error = null;
      const available = true;
      callback(error, available);
    });

    confirmRequestedBrokersAreValid(["broker1:9092", "broker2:9095"]);
    expect(mockProbe).toBeCalledTimes(2);

    const firstCall = mockProbe.mock.calls[0];
    expect(firstCall[0]).toBe("broker1");
    expect(firstCall[1]).toBe("9092");

    const secondCall = mockProbe.mock.calls[1];
    expect(secondCall[0]).toBe("broker2");
    expect(secondCall[1]).toBe("9095");
  });

  it("does not error if at least one broker does not error", done => {
    mockProbe.mockImplementationOnce((_broker, _port, callback) => {
      const error = true;
      const available = true;
      callback(error, available);
    });
    mockProbe.mockImplementationOnce((_broker, _port, callback) => {
      const error = null;
      const available = true;
      callback(error, available);
    });

    confirmRequestedBrokersAreValid(["broker1:9092", "broker2:9092"]).then(
      done
    );
  });

  it("does not error if at least one broker does is available", done => {
    mockProbe.mockImplementationOnce((_broker, _port, callback) => {
      const error = false;
      const available = false;
      callback(error, available);
    });
    mockProbe.mockImplementationOnce((_broker, _port, callback) => {
      const error = null;
      const available = true;
      callback(error, available);
    });

    confirmRequestedBrokersAreValid(["broker1:9092", "broker2:9092"]).then(
      done
    );
  });

  it("Throws an error if error is true for all brokers", done => {
    mockProbe.mockImplementation((_broker, _port, callback) => {
      const error = true;
      const available = true;
      callback(error, available);
    });

    confirmRequestedBrokersAreValid(["broker1:9092", "broker2:9092"]).catch(
      error => {
        expect(isError(error)).toBe(true);
        done();
      }
    );
  });

  it("Throws an error if all brokers are not available", done => {
    mockProbe.mockImplementation((_broker, _port, callback) => {
      const error = null;
      const available = false;
      callback(error, available);
    });

    confirmRequestedBrokersAreValid(["broker1:9092", "broker2:9092"]).catch(
      error => {
        expect(isError(error)).toBe(true);
        done();
      }
    );
  });

  it("Throws an error if a host and a port cannot be identified from any of the given brokers", done => {
    confirmRequestedBrokersAreValid(["broker19092"]).catch(error => {
      expect(isError(error)).toBe(true);
      done();
    });
  });
});
