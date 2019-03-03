const upsertToTopicAndConsumerGroup = require("./upsert-to-topic-and-consumer-group");
const testDatabaseMigration = require("../test-database-migration");
const { query } = require("server-common/database/sqlite-connections");

describe("upsertToTopicAndConsumerGroup", () => {
  let db = null;

  beforeAll(async () => {
    db = testDatabaseMigration();
    await db.up();
  });

  afterAll(async () => {
    await db.down();
  });

  it("Insert into topicAndConsumerGroup", async () => {
    await upsertToTopicAndConsumerGroup("topic1", "group1", 1234);

    const expected = [
      { topicName: "topic1", consumerGroupName: "group1", lastActive: 1234 }
    ];
    const actual = await query(
      "SELECT topicName, consumerGroupName, lastActive FROM topicsAndConsumerGroups"
    );
    expect(actual).toEqual(expected);
  });

  it("Replaces previous rows if Topic Name and Consumer Group Id match", async () => {
    await upsertToTopicAndConsumerGroup("topic1", "group1", 1234);
    await upsertToTopicAndConsumerGroup("topic1", "group1", 9876);

    const expected = [
      { topicName: "topic1", consumerGroupName: "group1", lastActive: 9876 }
    ];
    const actual = await query(
      "SELECT topicName, consumerGroupName, lastActive FROM topicsAndConsumerGroups"
    );
    expect(actual).toEqual(expected);
  });
});
