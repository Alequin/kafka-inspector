const PRODUCTION = "production";
const DEVELOPMENT = "development";
const SERVER_ONLY = "server-only";
const TEST = "test";

const isTest = process.env.NODE_ENV === TEST;
const isProduction = process.argv.includes(PRODUCTION) && !isTest;
const isDevelopment = !isProduction && !isTest;

const isServerOnly = process.argv.includes(SERVER_ONLY);

const { freeze } = Object;
const environmentVariables = freeze({
  OPTIONS: freeze({
    PRODUCTION,
    DEVELOPMENT,
    TEST
  }),
  isProduction,
  isDevelopment,
  isTest,
  isServerOnly
});

const identifyCurrentEnvironment = ({
  isProduction,
  isDevelopment,
  isTest
}) => {
  if (isProduction) return PRODUCTION;
  if (isDevelopment) return DEVELOPMENT;
  if (isTest) return TEST;
  throw new Error("No environment set");
};

module.exports = {
  ...environmentVariables,
  currentEnvironment: identifyCurrentEnvironment(environmentVariables)
};
