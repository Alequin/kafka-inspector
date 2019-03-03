const createMessageManager = require("./create-consumer-manager");

describe("createMessageManager", () => {
  const maxOffset = 2;
  describe("When the message offset is less then the max requested offset", () => {
    const mockMessage = {
      offset: maxOffset - 1
    };

    it("Returns shouldCloseConsumer as false", () => {
      const consumerManager = createMessageManager(maxOffset);
      const expected = false;
      const { shouldCloseConsumer: actual } = consumerManager(mockMessage);
      expect(actual).toBe(expected);
    });

    it("Returns the current list of messages, which should include the message given", () => {
      const consumerManager = createMessageManager(maxOffset);
      const expected = [mockMessage];
      const { messages: actual } = consumerManager(mockMessage);
      expect(actual).toEqual(expected);
    });
  });

  describe("When the message offset is equal to the max requested offset", () => {
    const mockMessage = {
      offset: maxOffset
    };

    it("Returns shouldCloseConsumer as false", () => {
      const consumerManager = createMessageManager(maxOffset);
      const expected = false;
      const { shouldCloseConsumer: actual } = consumerManager(mockMessage);
      expect(actual).toBe(expected);
    });

    it("Returns the current list of messages, which should include the message given", () => {
      const consumerManager = createMessageManager(maxOffset);
      const expected = [mockMessage];
      const { messages: actual } = consumerManager(mockMessage);
      expect(actual).toEqual(expected);
    });
  });

  describe("When the message offset is greater than the max requested offset", () => {
    const mockMessage = {
      offset: maxOffset + 1
    };

    it("Returns shouldCloseConsumer as true", () => {
      const consumerManager = createMessageManager(maxOffset);
      const expected = true;
      const { shouldCloseConsumer: actual } = consumerManager(mockMessage);
      expect(actual).toBe(expected);
    });

    it("Returns the current list of messages, which should exclude the message given", () => {
      const consumerManager = createMessageManager(maxOffset);
      const expected = [];
      const { messages: actual } = consumerManager(mockMessage);
      expect(actual).toEqual(expected);
    });
  });

  it("Should throw an error if maxOffset is not defined", () => {
    expect(() => createMessageManager()).toThrow();
  });
});
