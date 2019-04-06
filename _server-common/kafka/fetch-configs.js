const { ResourceTypes } = require("kafkajs");
const { first, omit } = require("lodash");
const { seconds } = require("server-common/time-to-milliseconds");
const kafkaJsAdmin = require("./kafka-connections/kafka-js-admin");
const simpleCache = require("./utils/simple-cache");

// Omit the resource types which dont work with the function 'admin.describeConfigs'
// For all types view https://github.com/tulios/kafkajs/blob/master/src/protocol/resourceTypes.js
const RESOURCE_TYPES = omit(ResourceTypes, ["ANY", "UNKNOWN"]);

const fetchConfigs = (resources, kafkaConnectionConfig) =>
  kafkaJsAdmin(kafkaConnectionConfig, admin =>
    admin.describeConfigs({ resources })
  );

const fetchConfigForSingleResource = resourceType => {
  return async (resourceName, kafkaConnectionConfig) => {
    const config = await fetchConfigs(
      [{ name: resourceName, type: resourceType }],
      kafkaConnectionConfig
    );

    const { errorCode, errorMessage, configEntries } = first(config.resources);

    const hasErrorOccurred = errorCode !== 0;
    if (hasErrorOccurred)
      throw new Error(
        `Error Code: ${errorCode} / ErrorMessage: ${errorMessage}`
      );

    return configEntries;
  };
};

// TODO - other resource type should be possible but always error when requested.
// Figure out why the others error or find another way to access other resource types
const topicConfig = fetchConfigForSingleResource(RESOURCE_TYPES.TOPIC);
const topicConfigWithCache = simpleCache(topicConfig, {
  refreshCacheAfter: seconds(30)
});

module.exports = {
  RESOURCE_TYPES,
  fetchConfigs,
  topicConfig,
  topicConfigWithCache
};
