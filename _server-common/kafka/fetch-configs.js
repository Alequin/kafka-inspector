const { ResourceTypes } = require("kafkajs");
const { first, omit } = require("lodash");
const accessGlobalKafkaConnections = require("./access-global-kafka-connections");

// Omit the resource types which dont work with the function 'admin.describeConfigs'
// For all types view https://github.com/tulios/kafkajs/blob/master/src/protocol/resourceTypes.js
const RESOURCE_TYPES = omit(ResourceTypes, ["ANY", "UNKNOWN"]);

const fetchConfigs = async resources => {
  const {
    kafkaJs: { admin }
  } = accessGlobalKafkaConnections();

  return await admin.describeConfigs({ resources });
};

const fetchConfigForSingleResource = resourceType => {
  return async resourceName => {
    const config = await fetchConfigs([
      { name: resourceName, type: resourceType }
    ]);

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

module.exports = {
  RESOURCE_TYPES,
  fetchConfigs,
  topicConfig
};
