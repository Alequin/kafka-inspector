const { get, set } = require("lodash");
const mockListTopics = require("./kafka-node/mock-list-topics");
const mockListGroups = require("./kafka-node/mock-list-groups");

module.exports = (overrides = []) => {
  const mock = {
    kafkaNode: {
      admin: {
        listTopics: callback => {
          const error = false;
          callback(error, mockListTopics.response);
        },
        listGroups: callback => {
          const error = false;
          callback(error, mockListGroups.response);
        }
      }
    }
  };

  overrides.forEach(({ path, override }) => {
    const isPathValid = get(mock, path, false);
    if (isPathValid) set(mock, path, override);
  });

  return mock;
};
