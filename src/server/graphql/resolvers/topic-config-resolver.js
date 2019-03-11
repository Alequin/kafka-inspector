const { omit } = require("lodash");
const { topicConfigWithCache } = require("server-common/kafka/fetch-configs");

const topicsConfigResolver = async (
  { name: topicName },
  _args,
  { kafkaConnectionConfig }
) => {
  const configs = await topicConfigWithCache(topicName, kafkaConnectionConfig);
  return configs.map(config => {
    return {
      ...omit(config, ["configName", "configValue"]),
      name: config.configName,
      value: config.configValue
    };
  });
};

module.exports = topicsConfigResolver;
