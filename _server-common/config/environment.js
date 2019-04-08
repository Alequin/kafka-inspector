const { PRODUCTION, DEVELOPMENT, TEST } = require("./environment-options");

const isTest = process.env.NODE_ENV === TEST;
const isProduction = process.env.NODE_ENV === PRODUCTION;
// Default to development if nothing is set
const isDevelopment = !isProduction && !isTest;

const environmentVariables = {
  isProduction,
  isDevelopment,
  isTest
};

const currentEnvironment = identifyCurrentEnvironment(environmentVariables);
process.env.BABEL_ENV = currentEnvironment;
process.env.NODE_ENV = currentEnvironment;

module.exports = Object.freeze({
  ...environmentVariables,
  currentEnvironment
});

function identifyCurrentEnvironment({ isProduction, isDevelopment, isTest }) {
  if (isProduction) return PRODUCTION;
  if (isDevelopment) return DEVELOPMENT;
  if (isTest) return TEST;
  throw new Error("No environment set");
}
