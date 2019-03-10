const { omit } = require("lodash");
const { topicConfig } = require("server-common/kafka/fetch-configs");

const topicsConfigResolver = async ({ name: topicName }) => {
  const configs = await topicConfig(topicName);
  return configs.map(config => {
    return {
      ...omit(config, ["configName", "configValue"]),
      name: config.configName,
      value: config.configValue
    };
  });
};

module.exports = topicsConfigResolver;
