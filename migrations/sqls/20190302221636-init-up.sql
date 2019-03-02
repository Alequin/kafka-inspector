CREATE TABLE topicAndConsumerGroup (
  id INTEGER PRIMARY KEY,
  topicName TEXT NOT NULL,
  consumerGroupName TEXT NOT NULL,
  lastActive INTEGER NOT NULL,
  UNIQUE(topicName, consumerGroupName)
);