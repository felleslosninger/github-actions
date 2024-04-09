import * as core from "@actions/core";

import * as InputsHelpers from "../src/helpers";
import { Inputs } from "../src/interfaces";
import { describe, it, jest, expect } from "@jest/globals";

jest.mock("@actions/core");

describe("loadInputs", () => {
  it("loads inputs correctly", () => {
    // act
    const { repository, head, base, githubToken }: Inputs =
      InputsHelpers.loadInputs();

    // assert
    expect(repository).toBe("mocked-repository");
    expect(head).toBe("mocked-head");
    expect(base).toBe("mocked-base");
    expect(githubToken).toBe("mocked-github-token");
  });

  it("loads default values", () => {
    // arrange
    jest.spyOn(core, "getInput").mockImplementation((name: string) => {
      if (name === "product") {
        return "mocked-product";
      } else if (name === "release-notes") {
        return '[""]';
      } else {
        return "";
      }
    });

    // act
    const { repository, head, base, githubToken }: Inputs =
      InputsHelpers.loadInputs();

    // assert
    expect(repository).toBe("");
    expect(head).toBe("");
    expect(base).toBe("");
    expect(githubToken).toBe("");
  });
});
