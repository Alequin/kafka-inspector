const removeTopicFromConsumer = require("./remove-topic-from-consumer");

describe("removeTopicFromConsumer", () => {
  it("Should attempt to remove topic and resolve without issues when there are no errors", async () => {
    const mockTopicName = "topicName";
    const mockRemoveTopics = jest
      .fn()
      .mockImplementation((_topicNames, callback) => {
        const error = false;
        callback(error, null);
      });
    const mockConsumer = {
      removeTopics: mockRemoveTopics
    };

    await removeTopicFromConsumer(mockConsumer, mockTopicName);

    expect(mockRemoveTopics).toBeCalledTimes(1);
    expect(mockRemoveTopics.mock.calls[0][0]).toEqual([mockTopicName]);
  });

  it("Should reject if there is an error", async () => {
    const mockErrorMessage = "remove topic error message";
    const mockTopicName = "topicName";
    const mockConsumer = {
      removeTopics: jest.fn().mockImplementation((_topicNames, callback) => {
        const error = mockErrorMessage;
        callback(error, null);
      })
    };

    await removeTopicFromConsumer(mockConsumer, mockTopicName).catch(error => {
      expect(error).toBe(mockErrorMessage);
    });
  });
});
