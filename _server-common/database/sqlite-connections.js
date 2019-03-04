const sqlite3 = require("sqlite3").verbose();
const { IS_TEST } = require("server-common/config/environment");
const database = require("./database.json");

const db = new sqlite3.Database(
  IS_TEST ? database.test.filename : database.db.filename
);

const afterQuery = (resolve, reject) => (error, response) => {
  error ? reject(error) : resolve(response);
};

const query = async (query, values) => {
  return new Promise((resolve, reject) => {
    db.all(query, values, afterQuery(resolve, reject));
  });
};

module.exports = { query };
