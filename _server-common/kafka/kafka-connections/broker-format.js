const checkBrokerFormat = broker => {
  const [brokerHost, port] = broker.split(":");
  const isEitherHostOrPortMissing = !brokerHost || !port;
  return {
    isInvalid: isEitherHostOrPortMissing,
    message: isEitherHostOrPortMissing
      ? `The format of the given broker is wrong. You must provide a host and a port: Expected: <host>:<port> | You give: ${broker}`
      : null
  };
};

const validateBrokerFormat = broker => {
  const { isInvalid, message } = checkBrokerFormat(broker);
  if (isInvalid) throw new Error(message);
};

module.exports = { checkBrokerFormat, validateBrokerFormat };
