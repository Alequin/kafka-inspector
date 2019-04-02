const deleteClusterById = require("./delete-cluster-by-id");
const testDatabaseMigration = require("mock-test-data/test-database-migration");
const runQuery = require("server-common/database/run-query");

describe("deleteClusterById", () => {
  let db = null;

  beforeEach(async () => {
    db = testDatabaseMigration();
    await db.up(Number.MAX_VALUE);
  });

  afterEach(async () => {
    await db.down(Number.MAX_VALUE);
  });

  it("Deletes a kafka cluster", async () => {
    // Manually insert cluster to test with
    await runQuery(`INSERT INTO clusters (brokers) VALUES (?)`, [
      "broker1:9092,broker2:9092,broker3:9092"
    ]);

    // Check if inserting cluster worked
    expect(await runQuery("SELECT * FROM clusters")).toEqual([
      { brokers: "broker1:9092,broker2:9092,broker3:9092", id: 1 }
    ]);

    // Delete the cluster
    await deleteClusterById(1);

    // Check deletion worked
    const expected = [];
    const actual = await runQuery("SELECT * FROM clusters");
    expect(actual).toEqual(expected);
  });
});
