import { toWritePrecisionType } from "../src/converters/input-to-write-precision-type";
import { expect } from "@jest/globals";

describe("toWritePrecisionType", () => {
  it("returns precision 'ns' for valid input", () => {
    expect(toWritePrecisionType("ns")).toBe("ns");
  });

  it("returns precision 'us' for valid input", () => {
    expect(toWritePrecisionType("us")).toBe("us");
  });

  it("returns precision 'ms' for valid input", () => {
    expect(toWritePrecisionType("ms")).toBe("ms");
  });

  it("returns precision 's' for valid input", () => {
    expect(toWritePrecisionType("s")).toBe("s");
  });

  it("throws error for invalid precision input", () => {
    expect(() => toWritePrecisionType("invalid")).toThrow(
      "Unsupported precision type: invalid"
    );
  });
});
