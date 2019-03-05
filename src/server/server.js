const express = require("express");
const bodyParser = require("body-parser");
const middleware = require("webpack-dev-middleware");
const webpackCompiler = require("server-common/webpack/webpack-compiler");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Only use the webpack config in development.
// The Minified javascript use in production is built from this config
// const shouldApplyDevWebpackConfig = isDevelopment && !isServerOnly
app.use(middleware(webpackCompiler, {}));

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
