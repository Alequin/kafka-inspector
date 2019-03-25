const { map, omitBy } = require("lodash");
const fetchBrokerDetailsAndTopicNames = require("./utils/fetch-broker-details-and-topics-names");

const transformToBrokerList = response => {
  const brokerList = response[0];
  const { controllerId } = response[1].clusterMetadata;

  return {
    controllerId,
    brokers: map(brokerList, broker => {
      return {
        ...omitBy(broker, ["nodeId"]),
        id: broker.nodeId
      };
    })
  };
};

const brokers = async kafkaConnectionConfig => {
  return transformToBrokerList(
    await fetchBrokerDetailsAndTopicNames(kafkaConnectionConfig)
  );
};

module.exports = brokers;
