const { isEmpty } = require("lodash");
const kafkaNode = require("kafka-node");

const validateBrokerFormat = broker => {
  const [brokerHost, port] = broker.split(":");
  const isEitherHostOrPortMissing = !brokerHost || !port;
  return {
    isInvalid: isEitherHostOrPortMissing,
    message: isEitherHostOrPortMissing
      ? `The format of the given broker is wrong. You must provide a host and a port: Expected: <host>:<port> | You give: ${broker}`
      : null
  };
};

const kafkaNodeAdmin = ({ kafkaBrokers }) => {
  const validatedBrokers = kafkaBrokers.map(validateBrokerFormat);
  const invalidBrokers = validatedBrokers.filter(({ isInvalid }) => isInvalid);
  if (!isEmpty(invalidBrokers)) {
    throw new Error(invalidBrokers.map(({ message }) => message).join("/r/n"));
  }

  const client = new kafkaNode.KafkaClient({
    kafkaHost: kafkaBrokers.join(",")
  });
  return new kafkaNode.Admin(client);
};

module.exports = kafkaNodeAdmin;
