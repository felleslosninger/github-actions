import { run } from "../src/main";
import * as Validators from "../src/validators";

import * as core from "@actions/core";
import { beforeEach, describe, it, jest, expect } from "@jest/globals";

describe("run function", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mock function calls before each test
  });

  it("should setFailed with specific message if validateInputs throws an error", async () => {
    // arrange
    const errorMessage = "Failed to validate inputs";
    const validateInputsSpy = jest
      .spyOn(Validators, "validateInputs")
      .mockRejectedValue(new Error(errorMessage));
    const coreSetFailedSpy = jest.spyOn(core, "setFailed");

    // act
    await run();

    // assert
    expect(validateInputsSpy).toHaveBeenCalled();
    expect(coreSetFailedSpy).toHaveBeenCalledWith(
      `Failed to validate pull request title: ${errorMessage}`
    );
  });

  it("should set is-valid to false if validateTitleLength fails", async () => {
    // arrange
    const errorMessage = "Title length not valid";
    const mockInputs = {
      pullRequestTitle: "Test PR",
      caseSensitivePrefix: true,
      maxLengthTitle: 100,
      minLengthTitle: 10,
      allowedPrefixes: ["Test"]
    };
    const mockLengthValidation = {
      isValid: false,
      message: errorMessage
    }; // Invalid result
    const validateInputsSpy = jest
      .spyOn(Validators, "validateInputs")
      .mockResolvedValue(mockInputs);
    const validateTitleLengthSpy = jest
      .spyOn(Validators, "validateTitleLength")
      .mockReturnValue(mockLengthValidation);
    const coreSetOutputSpy = jest.spyOn(core, "setOutput");

    // act
    await run();

    // assert
    expect(validateInputsSpy).toHaveBeenCalled();
    expect(validateTitleLengthSpy).toHaveBeenCalledWith(
      mockInputs.pullRequestTitle,
      mockInputs.minLengthTitle,
      mockInputs.maxLengthTitle
    );
    expect(coreSetOutputSpy).toHaveBeenCalledWith("is-valid", false);
    expect(coreSetOutputSpy).toHaveBeenCalledWith(
      "error-message",
      errorMessage
    );
  });

  it("should set is-valid to false if validateTitlePrefixes fails", async () => {
    // arrange
    const errorMessage = "Title prefix not valid";
    const mockInputs = {
      pullRequestTitle: "Test PR",
      caseSensitivePrefix: true,
      maxLengthTitle: 100,
      minLengthTitle: 10,
      allowedPrefixes: ["Test"]
    };
    const mockLengthValidation = { isValid: true }; // Valid result
    const mockPrefixesValidation = {
      isValid: false,
      message: errorMessage
    }; // Invalid result
    const validateInputsSpy = jest
      .spyOn(Validators, "validateInputs")
      .mockResolvedValue(mockInputs);
    const validateTitleLengthSpy = jest
      .spyOn(Validators, "validateTitleLength")
      .mockReturnValue(mockLengthValidation);
    const validateTitlePrefixesSpy = jest
      .spyOn(Validators, "validateTitlePrefixes")
      .mockReturnValue(mockPrefixesValidation);
    const coreSetOutputSpy = jest.spyOn(core, "setOutput");

    // act
    await run();

    // assert
    expect(validateInputsSpy).toHaveBeenCalled();
    expect(validateTitleLengthSpy).toHaveBeenCalledWith(
      mockInputs.pullRequestTitle,
      mockInputs.minLengthTitle,
      mockInputs.maxLengthTitle
    );
    expect(validateTitlePrefixesSpy).toHaveBeenCalledWith(
      mockInputs.pullRequestTitle,
      mockInputs.allowedPrefixes,
      mockInputs.caseSensitivePrefix
    );
    expect(coreSetOutputSpy).toHaveBeenCalledWith("is-valid", false);
    expect(coreSetOutputSpy).toHaveBeenCalledWith(
      "error-message",
      errorMessage
    );
  });

  it("should call core.info if all validations pass", async () => {
    // arrange
    const mockInputs = {
      pullRequestTitle: "Test PR",
      caseSensitivePrefix: true,
      maxLengthTitle: 100,
      minLengthTitle: 10,
      allowedPrefixes: ["Test"]
    };
    const mockLengthValidation = { isValid: true }; // Valid result
    const mockPrefixesValidation = { isValid: true }; // Valid result
    const validateInputsSpy = jest
      .spyOn(Validators, "validateInputs")
      .mockResolvedValue(mockInputs);
    const validateTitleLengthSpy = jest
      .spyOn(Validators, "validateTitleLength")
      .mockReturnValue(mockLengthValidation);
    const validateTitlePrefixesSpy = jest
      .spyOn(Validators, "validateTitlePrefixes")
      .mockReturnValue(mockPrefixesValidation);
    const coreInfoSpy = jest.spyOn(core, "info");
    const coreSetOutputSpy = jest.spyOn(core, "setOutput");

    // act
    await run();

    // assert
    expect(validateInputsSpy).toHaveBeenCalled();
    expect(validateTitleLengthSpy).toHaveBeenCalled();
    expect(validateTitlePrefixesSpy).toHaveBeenCalled();
    expect(coreInfoSpy).toHaveBeenCalledWith(
      "Pull Request title validation passed."
    );
    expect(coreSetOutputSpy).toHaveBeenCalledWith("is-valid", true);
  });

  it("should throw an error with specific message if error is not an instance of Error", async () => {
    // arrange
    const error = "An unexpected error occurred";
    const validateInputsSpy = jest
      .spyOn(Validators, "validateInputs")
      .mockRejectedValue(error);
    const coreSetFailedSpy = jest.spyOn(core, "setFailed");
    const coreSetOutputSpy = jest.spyOn(core, "setOutput");

    // act
    await run();

    // assert
    expect(validateInputsSpy).toHaveBeenCalled();
    expect(coreSetFailedSpy).toHaveBeenCalledWith(
      "Failed to validate pull request title: Unknown error"
    );
    expect(coreSetOutputSpy).not.toHaveBeenCalled();
  });
});
