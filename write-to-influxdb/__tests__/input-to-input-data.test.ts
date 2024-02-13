import { toInputData } from "../src/converters/input-to-input-data";
import { expect } from "@jest/globals";

describe("toInputData", () => {
  it("parses valid JSON input", () => {
    const json =
      '{"tags":[{"key1":"value1"},{"key2":"value2"}],"stringFields":[{"key3":"value2"},{"key4":"value4"}]}';

    const expectedData = {
      tags: [{ key1: "value1" }, { key2: "value2" }],
      stringFields: [{ key3: "value2" }, { key4: "value4" }]
    };

    expect(toInputData(json)).toEqual(expectedData);
  });

  it("throws error for invalid JSON input", () => {
    const invalidJson = "invalid JSON";

    expect(() => toInputData(invalidJson)).toThrow(SyntaxError);
  });
});
