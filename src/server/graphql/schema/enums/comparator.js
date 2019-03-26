const { map } = require("lodash");
const comparatorOptions = require("../../constants/comparator-options");

const options = map(comparatorOptions, value => value);
module.exports = `enum Comparator {${options.join(" ")}}`;
