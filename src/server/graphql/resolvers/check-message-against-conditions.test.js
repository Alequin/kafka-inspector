const DIVIDER = require("server-common/divider");
const {
  EQUAL_TO,
  NOT_EQUAL_TO,
  LESS_THAN,
  LESS_THAN_OR_EQUAL_TO,
  GREATER_THAN,
  GREATER_THAN_OR_EQUAL_TO,
  REGEXP
} = require("../constants/comparator-options");
const { JSON_ENCODING } = require("../constants/parsing-options");
const checkMessageAgainstConditions = require("./check-message-against-conditions");

describe("checkMessageAgainstConditions", () => {
  it(`matches against the message value when object path starts with value`, () => {
    const mockMessage = {
      key: 123,
      value: JSON.stringify({ food: "eggs" })
    };
    const conditions = {
      encoding: JSON_ENCODING,
      conditions: [
        [
          {
            value: "eggs",
            objectPath: "value.food",
            comparator: EQUAL_TO
          }
        ]
      ]
    };

    const actual = checkMessageAgainstConditions(mockMessage, conditions);
    expect(actual).toBe(true);
  });

  it(`matches against the message key when object path staerts with key`, () => {
    const mockMessage = {
      key: 123,
      value: JSON.stringify({ food: "eggs" })
    };
    const conditions = {
      encoding: JSON_ENCODING,
      conditions: [
        [
          {
            value: 123,
            objectPath: "key",
            comparator: EQUAL_TO
          }
        ]
      ]
    };

    const actual = checkMessageAgainstConditions(mockMessage, conditions);
    expect(actual).toBe(true);
  });

  describe("When comparator is EQUAL_TO", () => {
    it(`Returns true if the given value matches the value returned
    from the objectPath`, () => {
      const mockMessage = {
        value: JSON.stringify({ food: "eggs" })
      };
      const conditions = {
        encoding: JSON_ENCODING,
        conditions: [
          [
            {
              value: "eggs",
              objectPath: "value.food",
              comparator: EQUAL_TO
            }
          ]
        ]
      };

      const actual = checkMessageAgainstConditions(mockMessage, conditions);
      expect(actual).toBe(true);
    });

    it(`Returns false if the given value does not match the value 
    returned from the objectPath`, () => {
      const mockMessage = {
        value: JSON.stringify({ food: "something other than eggs" })
      };
      const conditions = {
        encoding: JSON_ENCODING,
        conditions: [
          [
            {
              value: "eggs",
              objectPath: "value.food",
              comparator: EQUAL_TO
            }
          ]
        ]
      };

      const actual = checkMessageAgainstConditions(mockMessage, conditions);
      expect(actual).toBe(false);
    });

    it(`When type returned by object path is a number returns true
    when given value is the equivalent string`, () => {
      const mockMessage = {
        value: JSON.stringify({ food: 100 })
      };
      const conditions = {
        encoding: JSON_ENCODING,
        conditions: [
          [
            {
              value: "100",
              objectPath: "value.food",
              comparator: EQUAL_TO
            }
          ]
        ]
      };

      const actual = checkMessageAgainstConditions(mockMessage, conditions);
      expect(actual).toBe(true);
    });

    it(`Returns false objectPath does not exist`, () => {
      const mockMessage = {
        value: JSON.stringify({ food: "eggs" })
      };
      const conditions = {
        encoding: JSON_ENCODING,
        conditions: [
          [
            {
              value: "eggs",
              objectPath: "value.food.type",
              comparator: EQUAL_TO
            }
          ]
        ]
      };

      const actual = checkMessageAgainstConditions(mockMessage, conditions);
      expect(actual).toBe(false);
    });
  });

  describe("When comparator is NOT_EQUAL_TO", () => {
    it(`Returns false if the given value matches the value returned
    from the objectPath`, () => {
      const mockMessage = {
        value: JSON.stringify({ food: "eggs" })
      };
      const conditions = {
        encoding: JSON_ENCODING,
        conditions: [
          [
            {
              value: "eggs",
              objectPath: "value.food",
              comparator: NOT_EQUAL_TO
            }
          ]
        ]
      };

      const actual = checkMessageAgainstConditions(mockMessage, conditions);
      expect(actual).toBe(false);
    });

    it(`Returns true if the given value does not match the value 
    returned from the objectPath`, () => {
      const mockMessage = {
        value: JSON.stringify({ food: "something other than eggs" })
      };
      const conditions = {
        encoding: JSON_ENCODING,
        conditions: [
          [
            {
              value: "eggs",
              objectPath: "value.food",
              comparator: NOT_EQUAL_TO
            }
          ]
        ]
      };

      const actual = checkMessageAgainstConditions(mockMessage, conditions);
      expect(actual).toBe(true);
    });
  });

  describe("When comparator is LESS_THAN", () => {
    it(`Returns true if the value returned from the objectPath 
    is less than the given value`, () => {
      const mockMessage = {
        value: JSON.stringify({ number: 100 })
      };
      const conditions = {
        encoding: JSON_ENCODING,
        conditions: [
          [
            {
              value: "101",
              objectPath: "value.number",
              comparator: LESS_THAN
            }
          ]
        ]
      };

      const actual = checkMessageAgainstConditions(mockMessage, conditions);
      expect(actual).toBe(true);
    });

    it(`Returns false if the value returned from the objectPath 
    is greater than the given value`, () => {
      const mockMessage = {
        value: JSON.stringify({ number: 100 })
      };
      const conditions = {
        encoding: JSON_ENCODING,
        conditions: [
          [
            {
              value: "99",
              objectPath: "value.number",
              comparator: LESS_THAN
            }
          ]
        ]
      };

      const actual = checkMessageAgainstConditions(mockMessage, conditions);
      expect(actual).toBe(false);
    });

    it(`Returns false if the value returned from the objectPath 
    is equal to the given value`, () => {
      const mockMessage = {
        value: JSON.stringify({ number: 100 })
      };
      const conditions = {
        encoding: JSON_ENCODING,
        conditions: [
          [
            {
              value: "100",
              objectPath: "value.number",
              comparator: LESS_THAN
            }
          ]
        ]
      };

      const actual = checkMessageAgainstConditions(mockMessage, conditions);
      expect(actual).toBe(false);
    });
  });

  describe("When comparator is LESS_THAN_OR_EQUAL_TO", () => {
    it(`Returns true if the value returned from the objectPath 
    is less than the given value`, () => {
      const mockMessage = {
        value: JSON.stringify({ number: 100 })
      };
      const conditions = {
        encoding: JSON_ENCODING,
        conditions: [
          [
            {
              value: "101",
              objectPath: "value.number",
              comparator: LESS_THAN_OR_EQUAL_TO
            }
          ]
        ]
      };

      const actual = checkMessageAgainstConditions(mockMessage, conditions);
      expect(actual).toBe(true);
    });

    it(`Returns false if the value returned from the objectPath 
    is greater than the given value`, () => {
      const mockMessage = {
        value: JSON.stringify({ number: 100 })
      };
      const conditions = {
        encoding: JSON_ENCODING,
        conditions: [
          [
            {
              value: "99",
              objectPath: "value.number",
              comparator: LESS_THAN_OR_EQUAL_TO
            }
          ]
        ]
      };

      const actual = checkMessageAgainstConditions(mockMessage, conditions);
      expect(actual).toBe(false);
    });

    it(`Returns true if the value returned from the objectPath 
    is equal to the given value`, () => {
      const mockMessage = {
        value: JSON.stringify({ number: 100 })
      };
      const conditions = {
        encoding: JSON_ENCODING,
        conditions: [
          [
            {
              value: "100",
              objectPath: "value.number",
              comparator: LESS_THAN_OR_EQUAL_TO
            }
          ]
        ]
      };

      const actual = checkMessageAgainstConditions(mockMessage, conditions);
      expect(actual).toBe(true);
    });
  });

  describe("When comparator is GREATER_THAN", () => {
    it(`Returns true if the value returned from the objectPath 
    is greater than the given value`, () => {
      const mockMessage = {
        value: JSON.stringify({ number: 100 })
      };
      const conditions = {
        encoding: JSON_ENCODING,
        conditions: [
          [
            {
              value: "99",
              objectPath: "value.number",
              comparator: GREATER_THAN
            }
          ]
        ]
      };

      const actual = checkMessageAgainstConditions(mockMessage, conditions);
      expect(actual).toBe(true);
    });

    it(`Returns false if the value returned from the objectPath 
    is greater than the given value`, () => {
      const mockMessage = {
        value: JSON.stringify({ number: 100 })
      };
      const conditions = {
        encoding: JSON_ENCODING,
        conditions: [
          [
            {
              value: "101",
              objectPath: "value.number",
              comparator: GREATER_THAN
            }
          ]
        ]
      };

      const actual = checkMessageAgainstConditions(mockMessage, conditions);
      expect(actual).toBe(false);
    });

    it(`Returns false if the value returned from the objectPath 
    is equal to the given value`, () => {
      const mockMessage = {
        value: JSON.stringify({ number: 100 })
      };
      const conditions = {
        encoding: JSON_ENCODING,
        conditions: [
          [
            {
              value: "100",
              objectPath: "value.number",
              comparator: GREATER_THAN
            }
          ]
        ]
      };

      const actual = checkMessageAgainstConditions(mockMessage, conditions);
      expect(actual).toBe(false);
    });
  });

  describe("When comparator is GREATER_THAN_OR_EQUAL_TO", () => {
    it(`Returns true if the value returned from the objectPath 
    is greater than the given value`, () => {
      const mockMessage = {
        value: JSON.stringify({ number: 100 })
      };
      const conditions = {
        encoding: JSON_ENCODING,
        conditions: [
          [
            {
              value: "99",
              objectPath: "value.number",
              comparator: GREATER_THAN_OR_EQUAL_TO
            }
          ]
        ]
      };

      const actual = checkMessageAgainstConditions(mockMessage, conditions);
      expect(actual).toBe(true);
    });

    it(`Returns false if the value returned from the objectPath 
    is greater than the given value`, () => {
      const mockMessage = {
        value: JSON.stringify({ number: 100 })
      };
      const conditions = {
        encoding: JSON_ENCODING,
        conditions: [
          [
            {
              value: "101",
              objectPath: "value.number",
              comparator: GREATER_THAN_OR_EQUAL_TO
            }
          ]
        ]
      };

      const actual = checkMessageAgainstConditions(mockMessage, conditions);
      expect(actual).toBe(false);
    });

    it(`Returns true if the value returned from the objectPath 
    is equal to the given value`, () => {
      const mockMessage = {
        value: JSON.stringify({ number: 100 })
      };
      const conditions = {
        encoding: JSON_ENCODING,
        conditions: [
          [
            {
              value: "100",
              objectPath: "value.number",
              comparator: GREATER_THAN_OR_EQUAL_TO
            }
          ]
        ]
      };

      const actual = checkMessageAgainstConditions(mockMessage, conditions);
      expect(actual).toBe(true);
    });
  });

  describe("When comparator is REGEXP", () => {
    it(`Returns true if the value returned from the objectPath 
    matches the given regex`, () => {
      const mockMessage = {
        value: JSON.stringify({ food: "eggs" })
      };
      const conditions = {
        encoding: JSON_ENCODING,
        conditions: [
          [
            {
              value: "gs",
              objectPath: "value.food",
              comparator: REGEXP
            }
          ]
        ]
      };

      const actual = checkMessageAgainstConditions(mockMessage, conditions);
      expect(actual).toBe(true);
    });

    it(`Returns false if the value returned from the objectPath 
    does not match the given regex`, () => {
      const mockMessage = {
        value: JSON.stringify({ food: "eggs" })
      };
      const conditions = {
        encoding: JSON_ENCODING,
        conditions: [
          [
            {
              value: "EGGS",
              objectPath: "value.food",
              comparator: REGEXP
            }
          ]
        ]
      };

      const actual = checkMessageAgainstConditions(mockMessage, conditions);
      expect(actual).toBe(false);
    });

    it(`Returns true if the value returned from the objectPath 
    does matches the given regex when the given flag is taken into account`, () => {
      const mockMessage = {
        value: JSON.stringify({ food: "eggs" })
      };
      const conditions = {
        encoding: JSON_ENCODING,
        conditions: [
          [
            {
              value: `EGGS${DIVIDER}i`,
              objectPath: "value.food",
              comparator: REGEXP
            }
          ]
        ]
      };

      const actual = checkMessageAgainstConditions(mockMessage, conditions);
      expect(actual).toBe(true);
    });
  });

  describe("When multiple conditions are given", () => {
    it(`Returns true when all conditions in the same set match`, () => {
      const mockMessage = {
        value: JSON.stringify({
          sandwich: {
            bread: "brown",
            content: "cheese"
          }
        })
      };

      const conditionSet1 = [
        {
          value: "brown",
          objectPath: "value.sandwich.bread",
          comparator: EQUAL_TO
        },
        {
          value: "cheese",
          objectPath: "value.sandwich.content",
          comparator: EQUAL_TO
        }
      ];

      const conditions = {
        encoding: JSON_ENCODING,
        conditions: [conditionSet1]
      };

      const actual = checkMessageAgainstConditions(mockMessage, conditions);
      expect(actual).toBe(true);
    });

    it(`Returns false when at least one conditions in the same set does not match`, () => {
      const mockMessage = {
        value: JSON.stringify({
          sandwich: {
            bread: "brown",
            content: "cheese"
          }
        })
      };

      const conditionSet1 = [
        {
          value: "brown",
          objectPath: "value.sandwich.bread",
          comparator: EQUAL_TO
        },
        {
          value: "eggs",
          objectPath: "value.sandwich.content",
          comparator: EQUAL_TO
        }
      ];

      const conditions = {
        encoding: JSON_ENCODING,
        conditions: [conditionSet1]
      };

      const actual = checkMessageAgainstConditions(mockMessage, conditions);
      expect(actual).toBe(false);
    });

    it(`Returns true when at least one condition set matches`, () => {
      const mockMessage = {
        value: JSON.stringify({
          sandwich: {
            bread: "brown",
            content: "cheese"
          }
        })
      };

      const conditionSet1 = [
        {
          value: "brown",
          objectPath: "value.sandwich.bread",
          comparator: EQUAL_TO
        }
      ];

      const conditionSet2 = [
        {
          value: "eggs",
          objectPath: "value.sandwich.content",
          comparator: EQUAL_TO
        }
      ];

      const conditions = {
        encoding: JSON_ENCODING,
        conditions: [conditionSet1, conditionSet2]
      };

      const actual = checkMessageAgainstConditions(mockMessage, conditions);
      expect(actual).toBe(true);
    });

    it(`Returns false when no condition sets match`, () => {
      const mockMessage = {
        value: JSON.stringify({
          sandwich: {
            bread: "brown",
            content: "cheese"
          }
        })
      };

      const conditionSet1 = [
        {
          value: "white",
          objectPath: "value.sandwich.bread",
          comparator: EQUAL_TO
        }
      ];

      const conditionSet2 = [
        {
          value: "eggs",
          objectPath: "value.sandwich.content",
          comparator: EQUAL_TO
        }
      ];

      const conditions = {
        encoding: JSON_ENCODING,
        conditions: [conditionSet1, conditionSet2]
      };

      const actual = checkMessageAgainstConditions(mockMessage, conditions);
      expect(actual).toBe(false);
    });
  });
});
