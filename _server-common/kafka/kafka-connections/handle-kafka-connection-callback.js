const handleKafkaConnectionCallback = (
  connection,
  closeConnection,
  callback
) => {
  try {
    return callback(connection);
  } catch (error) {
    throw error;
  } finally {
    closeConnection();
  }
};

module.exports = handleKafkaConnectionCallback;
