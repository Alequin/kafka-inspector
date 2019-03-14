const FROM_REQUESTED_OFFSET = true;

const addNewTopicToConsumer = (
  consumer,
  { topicName, partition, startingOffset }
) => {
  return new Promise((resolve, reject) => {
    consumer.addTopics(
      [{ topic: topicName, partition, offset: startingOffset }],
      (error, added) => {
        error ? reject(error) : resolve();
      },
      FROM_REQUESTED_OFFSET
    );
  });
};

module.exports = addNewTopicToConsumer;
