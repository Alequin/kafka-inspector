const tcpp = require("tcp-ping");

const expectedFormatMessage =
  "(make sure the provided format is '<broker-address>:<port>')";

const isBrokerAvailable = broker => {
  const [brokerHost, port] = broker.split(":");
  if (!brokerHost || !port)
    throw new Error(
      `The given broker was in a bad format: ${broker} / ${expectedFormatMessage}`
    );
  tcpp.probe(brokerHost, port, (error, available) => {
    if (error) {
      throw new Error(
        "There was an error while checking if the broker was available: " +
          error
      );
    }
    if (!available) {
      throw new Error(
        `broker not available: ${broker} / ${expectedFormatMessage}`
      );
    }
  });
};

const confirmRequestedBrokersAreValid = kafkaBrokers => {
  for (const broker of kafkaBrokers) {
    isBrokerAvailable(broker);
  }
};

module.exports = confirmRequestedBrokersAreValid;
