const {
  currentEnvironment,
  isProduction,
  isServerOnly
} = require("server-common/config/environment");

const express = require("express");
const bodyParser = require("body-parser");
const sendFile = require("./send-file");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Only use the webpack config in development.
// The Minified javascript use in production is built from this config
const sourceAssestFile = isProduction ? "/build" : "/dist";

const requestForAssets = /.js$|.css$|.json$|.map$/;
app.get(requestForAssets, (req, res) => {
  sendFile(res, `/${sourceAssestFile}${req.url}`).catch(error => {
    res.status(500).send(error);
  });
});

const allRoutes = /\.*/;
const HOME_ROUTE = `${sourceAssestFile}/index.html`;
app.get(allRoutes, (_req, res) => {
  sendFile(res, HOME_ROUTE).catch(error => {
    res.status(500).send(error);
  });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Environment:", currentEnvironment);
  isServerOnly && console.log("Server only mode is on");
});
