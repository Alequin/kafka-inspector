const { map } = require("lodash");
const parsingOptions = require("../../constants/parsing-options");

const options = map(parsingOptions, value => value);
module.exports = `
  enum Encoding {${options.join(" ")}}
`;
