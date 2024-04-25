import { jest, describe, it, expect } from "@jest/globals";
import * as core from "@actions/core";

import * as Validators from "../src/validators";

describe("validateInputs", () => {
  it("loads inputs correctly", async () => {
    // act
    const {
      pullRequestTitle,
      caseSensitivePrefix,
      maxLengthTitle,
      minLengthTitle,
      allowedPrefixes
    } = await Validators.validateInputs();

    // assert
    expect(pullRequestTitle).toBe("mocked-pull-request-title");
    expect(caseSensitivePrefix).toBe(true);
    expect(maxLengthTitle).toBe(100);
    expect(minLengthTitle).toBe(10);
    expect(allowedPrefixes).toEqual(["mocked-allowed-prefixes"]);
  });

  it("loads inputs with invalid maxLengthTitle", async () => {
    // arrange
    jest.mock("@actions/core");

    jest.spyOn(core, "getInput").mockImplementation((name: string) => {
      if (name === "max-length-title") {
        return "max-length-title";
      } else {
        return "";
      }
    });

    // act & assert
    await expect(Validators.validateInputs()).rejects.toThrowError(
      "Invalid input: max-length-title and min-length-title must be numeric."
    );
  });

  it("loads inputs with invalid minLengthTitle", async () => {
    // arrange
    jest.mock("@actions/core");

    jest.spyOn(core, "getInput").mockImplementation((name: string) => {
      if (name === "min-length-title") {
        return "0";
      }
      if (name === "max-length-title") {
        return "100";
      } else {
        return "";
      }
    });

    // act & assert
    await expect(Validators.validateInputs()).rejects.toThrowError(
      "Invalid input: min-length-title must be greater than 0."
    );
  });

  it("loads inputs with invalid minLengthTitle and maxLengthTitle combo", async () => {
    // arrange
    jest.mock("@actions/core");

    jest.spyOn(core, "getInput").mockImplementation((name: string) => {
      if (name === "min-length-title") {
        return "10";
      }
      if (name === "max-length-title") {
        return "9";
      } else {
        return "";
      }
    });

    // act & assert
    await expect(Validators.validateInputs()).rejects.toThrowError(
      "Invalid input: max-length-title cannot be smaller than min-length-title."
    );
  });
});
