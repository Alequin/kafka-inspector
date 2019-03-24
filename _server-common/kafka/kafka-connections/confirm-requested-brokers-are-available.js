const tcpp = require("tcp-ping");

const expectedFormatMessage =
  "(make sure the provided format is '<broker-address>:<port>')";

const isBrokerAvailable = broker => {
  return new Promise(resolve => {
    const [brokerHost, port] = broker.split(":");
    if (!brokerHost || !port) {
      resolve({
        error: true,
        message: `The given broker was in a bad format: ${broker} / ${expectedFormatMessage}`
      });
    }
    tcpp.probe(brokerHost, port, (error, available) => {
      if (error) {
        resolve({
          error: true,
          message:
            "There was an error while checking if the broker was available: " +
            error
        });
      }
      if (!available) {
        resolve({
          error: true,
          message: `broker not available: ${broker} / ${expectedFormatMessage}`
        });
      }
      resolve({ error: false, message: "" });
    });
  });
};

const confirmRequestedBrokersAreValid = async kafkaBrokers => {
  const brokerStatuses = await Promise.all(kafkaBrokers.map(isBrokerAvailable));
  const areAnyBrokersAvailable = brokerStatuses.some(({ error }) => !error);
  if (!areAnyBrokersAvailable) {
    const errorMessages = brokerStatuses
      .map(({ message }) => message)
      .join("//");
    throw new Error(errorMessages);
  }
};

module.exports = confirmRequestedBrokersAreValid;
