const { PRODUCTION, DEVELOPMENT, TEST } = require("./environment-options");

const isTest = process.env.NODE_ENV === TEST;
const isProduction = process.env.NODE_ENV === PRODUCTION;
// Default to development if nothing is set
const isDevelopment = !isProduction && !isTest;
if (isDevelopment) {
  process.env.BABEL_ENV = DEVELOPMENT;
  process.env.NODE_ENV = DEVELOPMENT;
}

const { freeze } = Object;
const environmentVariables = {
  isProduction,
  isDevelopment,
  isTest
};

module.exports = freeze({
  ...environmentVariables,
  currentEnvironment: identifyCurrentEnvironment(environmentVariables)
});

function identifyCurrentEnvironment({ isProduction, isDevelopment, isTest }) {
  if (isProduction) return PRODUCTION;
  if (isDevelopment) return DEVELOPMENT;
  if (isTest) return TEST;
  throw new Error("No environment set");
}
