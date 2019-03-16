const { get, set } = require("lodash");

const mockListTopics = require("./kafka-node/mock-list-topics");
const mockListGroups = require("./kafka-node/mock-list-groups");
const mockDescribeGroups = require("./kafka-node/mock-describe-groups");
const mockFetchLatestOffsets = require("./kafka-node/mock-fetch-latest-offsets");

const mockDescribeConfigs = require("./kafkajs/mock-describe-configs");
const mockFetchOffsets = require("./kafkajs/mock-fetch-offsets");
const mockGetTopicMetadata = require("./kafkajs/mock-get-topic-metadata");

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
      },
      consumer: jest.fn().mockImplementation(() => {
        return {
          on: (_eventType, callback) => {
            const message = { offset: 1, partition: 0 };
            callback(message);
          },
          removeTopics: jest.fn().mockImplementation((_topics, callback) => {
            const error = false;
            callback(error);
          }),
          addTopics: jest.fn().mockImplementation((_topics, callback) => {
            const error = false;
            callback(error);
          }),
          close: () => {},
          payloads: [
            {
              partition: 0
            }
          ]
        };
      })
    },
    kafkaJs: {
      admin: {
        describeConfigs: jest
          .fn()
          .mockResolvedValue(mockDescribeConfigs.response),
        fetchOffsets: jest.fn().mockResolvedValue(mockFetchOffsets.response),
        getTopicMetadata: jest
          .fn()
          .mockResolvedValue(mockGetTopicMetadata.response)
      }
    }
  };

  overrides.forEach(({ path, override }) => {
    const isPathValid = get(mock, path, false);
    if (isPathValid) set(mock, path, override);
  });

  return mock;
};
