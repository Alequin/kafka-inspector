const deleteByTopicName = require("./delete-by-topic-name");
const testDatabaseMigration = require("../test-database-migration");
const { query } = require("server-common/database/sqlite-connections");

describe("deleteByTopicName", () => {
  let db = null;

  beforeAll(async () => {
    db = testDatabaseMigration();
    await db.up();
  });

  afterAll(async () => {
    await db.down();
  });

  it("Deletes all rows with a matching Topic Name", async () => {
    await query(
      "INSERT INTO topicsAndConsumerGroups VALUES (1, 'topic1', 'group1', 123)"
    );

    await deleteByTopicName(["topic1"]);

    const expected = [];
    const actual = await query("SELECT * FROM topicsAndConsumerGroups");

    expect(actual).toEqual(expected);
  });
});
