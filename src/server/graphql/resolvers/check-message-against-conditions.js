const { get, isNumber } = require("lodash");
const DIVIDER = require("server-common/divider");
const { JSON_ENCODING } = require("../constants/parsing-options");
const {
  EQUAL_TO,
  NOT_EQUAL_TO,
  LESS_THAN,
  LESS_THAN_OR_EQUAL_TO,
  GREATER_THAN,
  GREATER_THAN_OR_EQUAL_TO,
  REGEXP
} = require("../constants/comparator-options");

const parse = {
  [JSON_ENCODING]: JSON.parse
  //[AVRO_ENCODING]: () => {}
};

const comparators = {
  [EQUAL_TO]: (value1, value2) => value1 === value2,
  [NOT_EQUAL_TO]: (value1, value2) => value1 !== value2,
  [LESS_THAN]: (value1, value2) => value1 < value2,
  [LESS_THAN_OR_EQUAL_TO]: (value1, value2) => value1 <= value2,
  [GREATER_THAN]: (value1, value2) => value1 > value2,
  [GREATER_THAN_OR_EQUAL_TO]: (value1, value2) => value1 >= value2,
  [REGEXP]: (value, regexpWithFlags) => {
    const [regexp, flags] = regexpWithFlags.trim().split(DIVIDER);
    return new RegExp(regexp, flags).test(value);
  }
};

const castValueToMatchingType = (valueToCheck, valueToCompare, comparator) => {
  if (comparator === REGEXP) return valueToCompare;

  return isNumber(valueToCheck)
    ? Number.parseFloat(valueToCompare)
    : valueToCompare;
};

const checkMessageAgainstConditions = (message, { encoding, conditions }) => {
  // TODO figure out how to parse avro messages
  const parsedMessage = {
    ...message,
    value: parse[encoding](message.value)
  };

  return conditions.some(conditionSet =>
    conditionSet.every(({ objectPath, value, comparator }) => {
      const valueToCheck = get(parsedMessage, objectPath, undefined);
      if (valueToCheck === undefined) return false;

      const valueToCompare = castValueToMatchingType(
        valueToCheck,
        value,
        comparator
      );

      return comparators[comparator](valueToCheck, valueToCompare);
    })
  );
};

module.exports = checkMessageAgainstConditions;
