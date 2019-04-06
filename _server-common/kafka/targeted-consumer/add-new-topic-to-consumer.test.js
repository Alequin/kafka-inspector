const addNewTopicToConsumer = require("./add-new-topic-to-consumer");

describe("addNewTopicToConsumer", () => {
  it("Should add new topic and resolve without issues when there are no errors", async () => {
    const mockTopicOptions = {
      topicName: "mockTopicName",
      partition: 0,
      startingOffset: 0
    };

    const mockAddTopics = jest
      .fn()
      .mockImplementation((_topics, callback, _fromRequestedOffset) => {
        const error = false;
        callback(error, null);
      });
    const mockConsumer = {
      addTopics: mockAddTopics
    };

    await addNewTopicToConsumer(mockConsumer, mockTopicOptions);

    expect(mockAddTopics).toBeCalledTimes(1);
    expect(mockAddTopics.mock.calls[0][0]).toEqual([
      {
        topic: mockTopicOptions.topicName,
        partition: mockTopicOptions.partition,
        offset: mockTopicOptions.startingOffset
      }
    ]);
  });

  it("Sets fromOffset to true so that the consumer makes use of the requested offset", async () => {
    const mockAddTopics = jest
      .fn()
      .mockImplementation((_topics, callback, _fromRequestedOffset) => {
        const error = false;
        callback(error, null);
      });
    const mockConsumer = {
      addTopics: mockAddTopics
    };

    await addNewTopicToConsumer(mockConsumer, {});

    expect(mockAddTopics.mock.calls[0][2]).toEqual(true);
  });

  it("Should reject if there is an error", async () => {
    const mockErrorMessage = "remove topic error message";

    const mockTopicOptions = {
      topicName: "mockTopicName",
      partition: 0,
      startingOffset: 0
    };

    const mockConsumer = {
      addTopics: jest
        .fn()
        .mockImplementation((_topics, callback, _fromRequestedOffset) => {
          const error = mockErrorMessage;
          callback(error, null);
        })
    };

    await addNewTopicToConsumer(mockConsumer, mockTopicOptions).catch(error => {
      expect(error).toBe(mockErrorMessage);
    });
  });
});
