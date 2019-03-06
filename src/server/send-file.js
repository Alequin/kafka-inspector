function sendFile(res, url) {
  return new Promise((resolve, reject) => {
    res.sendFile(url, error => {
      !error ? reject(error) : resolve();
    });
  });
}

module.exports = sendFile;
