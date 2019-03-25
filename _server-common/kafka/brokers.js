const { map, omitBy } = require("lodash");
const fetchBrokerDetailsAndTopicNames = require("./utils/fetch-broker-details-and-topics-names");

const transformToBrokerList = response => {
  const brokerList = response[0];
  const { controllerId } = response[1].clusterMetadata;

  return map(brokerList, broker => {
    const id = broker.nodeId;
    return {
      ...omitBy(broker, ["nodeId"]),
      id,
      isController: id === controllerId
    };
  });
};

const brokers = async kafkaConnectionConfig => {
  return fetchBrokerDetailsAndTopicNames(kafkaConnectionConfig).then(
    transformToBrokerList
  );
};

module.exports = brokers;
