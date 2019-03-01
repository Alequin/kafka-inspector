const events = require("events");
const consumeMessages = require("./consume-messages");

describe("consumeMessages", () => {
  const maxOffset = 10;

  const messagesBelowMaxOffset = [{ offset: 1 }, { offset: 5 }, { offset: 10 }];

  const messageAboveMaxOffset = [{ offset: 11 }];

  it("Returns the consumed messages", done => {
    const mockConsumer = new events.EventEmitter();
    mockConsumer.close = () => {};

    consumeMessages(mockConsumer, maxOffset).then(messages => {
      const expected = messagesBelowMaxOffset;
      const actual = messages;
      expect(actual).toEqual(expected);
      done();
    });

    // Send messages to mock consumer
    [...messagesBelowMaxOffset, ...messageAboveMaxOffset].forEach(message => {
      mockConsumer.emit("message", message);
    });
  });

  it("Calls close on consumer once complete", done => {
    const mockConsumer = new events.EventEmitter();
    const mockCloseFunction = jest.fn();
    mockConsumer.close = mockCloseFunction;

    consumeMessages(mockConsumer, maxOffset).then(() => {
      const expected = 1;
      expect(mockCloseFunction).toHaveBeenCalledTimes(expected);
      done();
    });

    // Send messages to mock consumer
    // Force consumer to close as message offset is greater than maxOffset
    [{ offset: Number.MAX_VALUE }].forEach(message => {
      mockConsumer.emit("message", message);
    });
  });
});
