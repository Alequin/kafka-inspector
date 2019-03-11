const mockProbe = jest.fn();
jest.mock("tcp-ping", () => {
  return {
    probe: mockProbe
  };
});

const confirmRequestedBrokersAreValid = require("./confirm-requested-brokers-are-available");

describe("confirmRequestedBrokersAreValid", () => {
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

  it("Throws an error if error is true", () => {
    mockProbe.mockImplementation((_broker, _port, callback) => {
      const error = true;
      const available = true;
      callback(error, available);
    });

    expect(() =>
      confirmRequestedBrokersAreValid(["broker1:9092", "broker2:9092"])
    ).toThrow();
  });

  it("Throws an error if broker is not available", () => {
    mockProbe.mockImplementation((_broker, _port, callback) => {
      const error = null;
      const available = false;
      callback(error, available);
    });

    expect(() =>
      confirmRequestedBrokersAreValid(["broker1:9092", "broker2:9092"])
    ).toThrow();
  });

  it("Throws an error if a host and a port cannot be identified from any of the given brokers", () => {
    expect(() => confirmRequestedBrokersAreValid(["broker19092"])).toThrow();

    expect(() =>
      confirmRequestedBrokersAreValid(["broker1:9092", ""])
    ).toThrow();
  });
});
