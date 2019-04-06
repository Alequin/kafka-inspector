const START_FROM_REQUESTED_OFFSET = true;

const addNewTopicToConsumer = (
  consumer,
  { topicName, partition, startingOffset }
) => {
  return new Promise((resolve, reject) => {
    consumer.addTopics(
      [{ topic: topicName, partition, offset: startingOffset }],
      (error, _added) => {
        error ? reject(error) : resolve();
      },
      START_FROM_REQUESTED_OFFSET
    );
  });
};

module.exports = addNewTopicToConsumer;
