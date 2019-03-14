const prepareMessagesObject = require("./prepare-message-object");

describe("prepareMessagesObject", () => {
  it("Creates an object with each property as a partition number and each value an empty array", () => {
    const expected = {
      "0": [],
      "2": [],
      "3": [],
      "60": []
    };

    const actual = prepareMessagesObject([0, 2, 3, 60]);
    expect(actual).toEqual(expected);
  });
});
