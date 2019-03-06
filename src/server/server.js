require("./process-input-args");

const {
  currentEnvironment,
  isServerOnly
} = require("server-common/config/environment");
const { appHtml, findInAssetFolder } = require("server-common/config/paths");

const express = require("express");
const bodyParser = require("body-parser");
const setupGraphql = require("./graphql/setup-graphql");
const sendFile = require("./send-file");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

setupGraphql(app);

const requestForAssets = /.js$|.css$|.json$|.map$|.ico$/;
app.get(requestForAssets, (req, res) => {
  sendFile(res, findInAssetFolder(req.url)).catch(error => {
    res.status(500).send(error);
  });
});

const allRoutes = /\.*/;
app.get(allRoutes, (_req, res) => {
  sendFile(res, appHtml).catch(error => {
    res.status(500).send(error);
  });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Environment:", currentEnvironment);
  isServerOnly && console.log("Server only mode is on");
});
