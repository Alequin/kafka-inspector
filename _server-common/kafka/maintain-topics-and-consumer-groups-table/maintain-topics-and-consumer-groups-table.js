const { seconds } = require("server-common/time-to-milliseconds");
const topicsAndConsumerGroups = require("server-common/database/queries/topics-and-consumer-groups");
const deleteByTopicName = require("server-common/database/queries/delete-by-topic-name");
const deleteByConsumerGroupName = require("server-common/database/queries/delete-by-consumer-group-name");
const upsertToTopicAndConsumerGroupTable = require("server-common/database/queries/upsert-to-topic-and-consumer-group");
const accessKafkaConnections = require("../access-kafka-connections");
const checkForDeletedTopicsOrConsumerGroups = require("./check-for-deleted-topics-or-consumer-groups");
const processMessageBatch = require("./process-message-batch");

const CONSUMER_OFFSETS_TOPIC_NAME = "__consumer_offsets";
const CONSUMER_GROUP = "jcox-420";

const consumerFrom = async (topicName, consumerGroup) => {
  const { kafkaJs } = accessKafkaConnections();
  const consumer = kafkaJs.client.consumer({
    groupId: consumerGroup
  });
  await consumer.connect();
  await consumer.subscribe({ topic: topicName });
  return consumer;
};

const maintainTopicsAndConsumerGroupsTable = async () => {
  const consumer = await consumerFrom(
    CONSUMER_OFFSETS_TOPIC_NAME,
    CONSUMER_GROUP
  );

  await consumer.run({
    eachBatchAutoResolve: true,
    autoCommitInterval: 500,
    autoCommitThreshold: 500,
    commitOffsetsIfNecessary: true,
    eachBatch: async ({ batch, heartbeat }) => {
      console.log("new batch");
      const newRows = processMessageBatch(batch);

      await heartbeat();

      for (const newRow of newRows) {
        await upsertToTopicAndConsumerGroupTable(
          newRow.topicName,
          newRow.consumerGroup.name,
          newRow.consumerGroup.lastActive
        );
      }
      console.log("batch processed");
    }
  });
};

maintainTopicsAndConsumerGroupsTable();

setInterval(async () => {
  const knownTopicAndConsumerGroups = await topicsAndConsumerGroups();
  const {
    deletedTopicNames,
    deletedConsumerGroupNames
  } = await checkForDeletedTopicsOrConsumerGroups(knownTopicAndConsumerGroups);

  deleteByTopicName(deletedTopicNames);
  deleteByConsumerGroupName(deletedConsumerGroupNames);
}, seconds(30));
