const DbMigrate = require("db-migrate");

const testDatabaseMigration = () => {
  const db = DbMigrate.getInstance(true, {
    env: "test",
    throwUncatched: true, // Don't crash the test runner if there is an error
    cmdOptions: {
      config: "./_server-common/database/database.json",
      "migrations-dir": "./migrations"
    }
  });

  db.silence(true); // No Logs

  return db;
};

module.exports = testDatabaseMigration;
