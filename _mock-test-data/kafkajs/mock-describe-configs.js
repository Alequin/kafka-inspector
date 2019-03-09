const mockConfigEntry = require("../data/mock-config-entry");

const response = {
  resources: [
    { errorCode: 0, errorMessage: null, configEntries: mockConfigEntry }
  ]
};

module.exports = {
  response
};
