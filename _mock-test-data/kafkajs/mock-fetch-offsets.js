const response = [
  { partition: 0, offset: "4" },
  { partition: 1, offset: "9" },
  { partition: 2, offset: "14" }
];

module.exports.response = response;

module.exports.transformedResponse = response.map(({ partition, offset }) => {
  return {
    partition,
    committedOffset: Number.parseInt(offset)
  };
});
