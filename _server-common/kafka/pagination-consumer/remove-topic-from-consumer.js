const removeTopicFromConsumer = (consumer, topicName) => {
  return new Promise((resolve, reject) => {
    consumer.removeTopics([topicName], (error, _removed) => {
      error ? reject(error) : resolve();
    });
  });
};

module.exports = removeTopicFromConsumer;
