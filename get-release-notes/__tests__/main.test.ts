import { run } from "../src/main";
import * as core from "@actions/core";
import * as InputsHelpers from "../src/helpers/inputs-helper";
import { describe, it, jest, expect, beforeEach } from "@jest/globals";
import { Inputs } from "../src/interfaces";

jest.mock("../src/release-notes", () => {
  return function () {
    return {
      getReleaseNotes: async () =>
        Promise.resolve([
          { message: "First commit" },
          { message: "Second commit" }
        ])
    };
  };
});

describe("run", () => {
  beforeEach(() => {
    // ReleaseNotesClient.mockClear();
  });

  it("should handle errors", async () => {
    // arrange
    const errorMessage = "Test error";

    jest.spyOn(InputsHelpers, "loadInputs").mockImplementation(() => {
      throw new Error(errorMessage);
    });

    const mockSetFailed = jest
      .spyOn(core, "setFailed")
      .mockImplementationOnce(() => {});

    // act
    await run();

    // assert
    expect(mockSetFailed).toHaveBeenCalledWith(errorMessage);
  });

  it("should call getReleaseNotes and set the output", async () => {
    // Arrange

    const mockInputs: Inputs = {
      repository: "owner/repo",
      head: "head",
      base: "base",
      githubToken: "token"
    };
    jest.spyOn(InputsHelpers, "loadInputs").mockReturnValue(mockInputs);
    jest.spyOn(core, "setOutput");

    // Act
    await run();

    // Assert
    expect(InputsHelpers.loadInputs).toHaveBeenCalled();
    expect(core.setOutput).toHaveBeenCalledWith("release-notes", [
      "First commit",
      "Second commit"
    ]);
  });
});
