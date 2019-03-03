const deleteByConsumerGroupName = require("./delete-by-consumer-group-name");
const testDatabaseMigration = require("../test-database-migration");
const { query } = require("server-common/database/sqlite-connections");

describe.only("deleteByConsumerGroupName", () => {
  let db = null;

  beforeAll(async () => {
    db = testDatabaseMigration();
    await db.up();
  });

  afterAll(async () => {
    await db.down();
  });

  it("Deletes all rows with a matching Consumer Group Name", async () => {
    await query(
      "INSERT INTO topicsAndConsumerGroups VALUES (1, 'topic1', 'group1', 123)"
    );

    await deleteByConsumerGroupName(["group1"]);

    const expected = [];
    const actual = await query("SELECT * FROM topicsAndConsumerGroups");

    expect(actual).toEqual(expected);
  });
});
