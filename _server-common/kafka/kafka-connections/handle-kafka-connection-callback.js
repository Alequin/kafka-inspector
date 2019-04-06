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
  const closeOnlyOnce = onlyCallOnce(closeConnection);

  try {
    return callback(connection, closeOnlyOnce);
  } catch (error) {
    throw error;
  } finally {
    closeOnlyOnce();
  }
};

module.exports = handleKafkaConnectionCallback;
