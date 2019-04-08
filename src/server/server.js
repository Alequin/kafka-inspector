require("./process-input-args");

const { createServer } = require("http");
const { currentEnvironment } = require("server-common/config/environment");
const { appHtml, findInAssetFolder } = require("server-common/config/paths");
const systemId = require("server-common/config/system-id");

const express = require("express");
const bodyParser = require("body-parser");
const setupGraphql = require("./graphql/setup-graphql");
const sendFile = require("./send-file");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const apolloServer = setupGraphql(app);

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
const wrappedServer = createServer(app);
apolloServer.installSubscriptionHandlers(wrappedServer);

wrappedServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Environment:", currentEnvironment);
  console.log("System Id:", systemId());
});
