const onlyCallOnce = func => {
  let hasRun = false;
  return (...args) => {
    if (!hasRun) {
      func(args);
      hasRun = true;
    }
  };
};

const handleKafkaConnectionCallback = async (
  connection,
  closeConnection,
  callback
) => {
  // Ensures that if close is called within the callback it is not called again once it completes
  const closeOnlyOnce = onlyCallOnce(closeConnection);

  try {
    return await callback(connection, closeOnlyOnce);
  } catch (error) {
    throw error;
  } finally {
    closeOnlyOnce();
  }
};

module.exports = handleKafkaConnectionCallback;
