const isPromise = require("server-common/is-promise");

const onlyCallOnce = func => {
  let hasRun = false;
  return (...args) => {
    if (!hasRun) {
      func(args);
      hasRun = true;
    }
  };
};

const handleKafkaConnectionCallback = (
  connection,
  closeConnection,
  callback
) => {
  // Ensures that if close is called within the callback it is not called again once it completes
  const closeOnlyOnce = onlyCallOnce(closeConnection);

  try {
    const result = callback(connection, closeOnlyOnce);

    if (isPromise(result)) {
      return result
        .then(toReturn => {
          closeOnlyOnce();
          return toReturn;
        })
        .catch(error => {
          closeOnlyOnce();
          throw error;
        });
    } else {
      closeOnlyOnce();
      return result;
    }
  } catch (error) {
    closeOnlyOnce();
    throw error;
  }
};

module.exports = handleKafkaConnectionCallback;
