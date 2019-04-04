const deleteClusterResolver = require("./delete-cluster-resolver");
const testDatabaseMigration = require("mock-test-data/test-database-migration");
const runQuery = require("server-common/database/run-query");

describe.skip("deleteClusterResolvers", () => {
  let db = null;

  beforeEach(async () => {
    db = testDatabaseMigration();
    await db.up();
  });

  afterEach(async () => {
    await db.down();
  });

  it("Deletes the kafak cluster row matching the given id", async () => {
    // Manually insert cluster to test with
    await runQuery(`INSERT INTO clusters (name, brokers) VALUES (?, ?)`, [
      "cluster name",
      "broker1:9092,broker2:9092,broker3:9092"
    ]);

    // Check if inserting cluster worked
    expect(await runQuery("SELECT * FROM clusters")).toHaveLength(1);

    // Delete the cluster
    await deleteClusterResolver({}, { clusterRowId: 1 });

    // Check deletion worked
    const expected = [];
    const actual = await runQuery("SELECT * FROM clusters");
    expect(actual).toEqual(expected);
  });
});
