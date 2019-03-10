const partitionsMetadataResolver = require("./partition-metadata-resolver");

describe("partitionsMetadataResolver", () => {
  it("Returns the parent unmodified", () => {
    const mockParent = {};
    expect(partitionsMetadataResolver(mockParent)).toBe(mockParent);
  });
});
