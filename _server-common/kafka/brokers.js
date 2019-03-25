const { map, omitBy } = require("lodash");
const accessGlobalKafkaConnections = require("./access-global-kafka-connections");

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

const brokers = kafkaConnectionConfig => {
  const {
    kafkaNode: { admin }
  } = accessGlobalKafkaConnections(kafkaConnectionConfig);

  return new Promise((resolve, reject) => {
    admin.listTopics((error, response) => {
      error ? reject(error) : resolve(transformToBrokerList(response));
    });
  });
};

module.exports = brokers;
