const { get, set } = require("lodash");
const mockListTopics = require("./kafka-node/mock-list-topics");
const mockListGroups = require("./kafka-node/mock-list-groups");
const mockDescribeConfigs = require("./kafkajs/mock-describe-configs");
const mockDescribeGroups = require("./kafka-node/mock-describe-groups");
const mockFetchLatestOffsets = require("./kafka-node/mock-fetch-latest-offsets");

module.exports = (overrides = []) => {
  const mock = {
    kafkaNode: {
      admin: {
        listTopics: jest.fn().mockImplementation(callback => {
          const error = false;
          callback(error, mockListTopics.response);
        }),
        listGroups: jest.fn().mockImplementation(callback => {
          const error = false;
          callback(error, mockListGroups.response);
        }),
        describeGroups: jest
          .fn()
          .mockImplementation((_groupNames, callback) => {
            const error = false;
            callback(error, mockDescribeGroups.response);
          })
      },
      offset: {
        fetchLatestOffsets: jest
          .fn()
          .mockImplementation((_topicNames, callback) => {
            const error = false;
            callback(error, mockFetchLatestOffsets.response);
          })
      }
    },
    kafkaJs: {
      admin: {
        describeConfigs: jest
          .fn()
          .mockResolvedValue(mockDescribeConfigs.response)
      }
    }
  };

  overrides.forEach(({ path, override }) => {
    const isPathValid = get(mock, path, false);
    if (isPathValid) set(mock, path, override);
  });

  return mock;
};
