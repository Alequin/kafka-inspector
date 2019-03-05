const express = require("express");
const bodyParser = require("body-parser");
const middleware = require("webpack-dev-middleware");
const {
  isDevelopment,
  isServerOnly
} = require("server-common/config/environment");
const webpackCompiler = require("server-common/webpack/webpack-compiler");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Only use the webpack config in development.
// The Minified javascript use in production is built from this config
const shouldApplyDevWebpackConfig = isDevelopment && !isServerOnly;
if (shouldApplyDevWebpackConfig) app.use(middleware(webpackCompiler, {}));

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  isServerOnly && console.log("Server only mode is on");
});
