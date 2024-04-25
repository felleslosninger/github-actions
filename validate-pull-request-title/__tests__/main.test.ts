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

  it("should setFailed with specific message if validateTitleLength fails", async () => {
    // arrange
    const mockInputs = {
      pullRequestTitle: "Test PR",
      caseSensitivePrefix: true,
      maxLengthTitle: 100,
      minLengthTitle: 10,
      allowedPrefixes: ["Test"]
    };
    const mockLengthValidation = { isValid: false, message: "Title too short" }; // Invalid result
    const validateInputsSpy = jest
      .spyOn(Validators, "validateInputs")
      .mockResolvedValue(mockInputs);
    const validateTitleLengthSpy = jest
      .spyOn(Validators, "validateTitleLength")
      .mockReturnValue(mockLengthValidation);
    const coreSetFailedSpy = jest.spyOn(core, "setFailed");

    // act
    await run();

    // assert
    expect(validateInputsSpy).toHaveBeenCalled();
    expect(validateTitleLengthSpy).toHaveBeenCalledWith(
      mockInputs.pullRequestTitle,
      mockInputs.minLengthTitle,
      mockInputs.maxLengthTitle
    );
    expect(coreSetFailedSpy).toHaveBeenCalledWith("Title too short");
  });

  it("should setFailed with uknown error message if validateTitleLength fails", async () => {
    // arrange
    const mockInputs = {
      pullRequestTitle: "Test PR",
      caseSensitivePrefix: true,
      maxLengthTitle: 100,
      minLengthTitle: 10,
      allowedPrefixes: ["Test"]
    };
    const mockLengthValidation = { isValid: false, message: undefined }; // Invalid result
    const validateInputsSpy = jest
      .spyOn(Validators, "validateInputs")
      .mockResolvedValue(mockInputs);
    const validateTitleLengthSpy = jest
      .spyOn(Validators, "validateTitleLength")
      .mockReturnValue(mockLengthValidation);
    const coreSetFailedSpy = jest.spyOn(core, "setFailed");

    // act
    await run();

    // assert
    expect(validateInputsSpy).toHaveBeenCalled();
    expect(validateTitleLengthSpy).toHaveBeenCalledWith(
      mockInputs.pullRequestTitle,
      mockInputs.minLengthTitle,
      mockInputs.maxLengthTitle
    );
    expect(coreSetFailedSpy).toHaveBeenCalledWith("Unknown error");
  });

  it("should setFailed with specific message if validateTitlePrefixes fails", async () => {
    // arrange
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
      message: "Invalid prefix"
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
    const coreSetFailedSpy = jest.spyOn(core, "setFailed");

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
    expect(coreSetFailedSpy).toHaveBeenCalledWith("Invalid prefix");
  });

  it("should setFailed with unknown error message if validateTitlePrefixes fails", async () => {
    // arrange
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
      message: undefined
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
    const coreSetFailedSpy = jest.spyOn(core, "setFailed");

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
    expect(coreSetFailedSpy).toHaveBeenCalledWith("Unknown error");
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

    // act
    await run();

    // assert
    expect(coreInfoSpy).toHaveBeenCalledWith(
      "Pull Request title validation passed."
    );
  });

  it("should throw an error with specific message if error is not an instance of Error", async () => {
    // arrange
    const error = "An unexpected error occurred";
    const validateInputsSpy = jest
      .spyOn(Validators, "validateInputs")
      .mockRejectedValue(error);
    const coreSetFailedSpy = jest.spyOn(core, "setFailed");

    // act
    await run();

    // assert
    expect(validateInputsSpy).toHaveBeenCalled();
    expect(coreSetFailedSpy).toHaveBeenCalledWith(
      "Failed to validate pull request title: Unknown error"
    );
  });
});
