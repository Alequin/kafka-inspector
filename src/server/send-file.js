const path = require("path");

const ROOT = "./../..";

function sendFile(res, url) {
  const filePath = path.join(__dirname, `${ROOT}${url}`);
  return new Promise((resolve, reject) => {
    res.sendFile(filePath, error => {
      if (!error) return resolve();
      reject(new Error(error));
    });
  });
}

module.exports = sendFile;
