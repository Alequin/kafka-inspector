const {
  PRODUCTION,
  DEVELOPMENT,
  SERVER_ONLY
} = require("server-common/config/environment-options");

const isProductionEnvironmentRequested = process.argv.includes(PRODUCTION);
process.env.NODE_ENV = isProductionEnvironmentRequested
  ? PRODUCTION
  : DEVELOPMENT;

process.env.SERVER_ONLY = process.argv.includes(SERVER_ONLY);
