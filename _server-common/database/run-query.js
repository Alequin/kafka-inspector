const sqlite3 = require("sqlite3").verbose();
const { isTest } = require("server-common/config/environment");
const database = require("./database.json");

const db = new sqlite3.Database(
  isTest ? database.test.filename : database.db.filename
);

const runQuery = async (query, values) => {
  return new Promise((resolve, reject) => {
    db.all(query, values, (error, response) => {
      error ? reject(error) : resolve(response);
    });
  });
};

module.exports = runQuery;
