var sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db");

const afterQuery = (resolve, reject) => (error, response) => {
  error ? reject(error) : resolve(response);
};

const query = async query => {
  return new Promise((resolve, reject) => {
    db.all(query, afterQuery(resolve, reject));
  });
};
const prepareQuery = query => {
  const preparedQuery = db.prepare(query);
  return async (...values) => {
    return new Promise((resolve, reject) => {
      preparedQuery.all(...values, afterQuery(resolve, reject));
    });
  };
};

module.exports = { query, prepareQuery };
