const kafkaNodeOffset = require("./kafka-connections/kafka-node-offset");

const fetchLatestOffsets = (topicName, kafkaConfigSettings) =>
  kafkaNodeOffset(
    kafkaConfigSettings,
    offset =>
      new Promise((resolve, reject) =>
        offset.fetchLatestOffsets([topicName], (error, response) =>
          error ? reject(error) : resolve(response[topicName])
        )
      )
  );

module.exports = fetchLatestOffsets;
