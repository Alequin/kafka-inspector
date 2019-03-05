const webpack = require("webpack");
const configFactory = require("./webpack.config");
const paths = require("./paths");
const {
  createCompiler,
  prepareUrls
} = require("react-dev-utils/WebpackDevServerUtils");

const USE_YARN = false;

const PORT = 4000;
const HOST = process.env.HOST || "0.0.0.0";

const config = configFactory("development");
const appName = require(paths.appPackageJson).name;
const protocol = process.env.HTTPS === "true" ? "https" : "http";
const urls = prepareUrls(protocol, HOST, PORT);

module.exports = createCompiler(webpack, config, appName, urls, USE_YARN);
