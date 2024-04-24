import { run } from "../src/main";
import * as core from "@actions/core";
import * as Validators from "../src/validators";

import { describe, it, jest, expect } from "@jest/globals";

describe("run function", () => {
  it("should call validateInputs and handleValidationResults with correct parameters", async () => {
    // Arrange
    const mockInputs = {
      pullRequestTitle: "Test PR",
      caseSensitivePrefix: true,
      maxLengthTitle: 100,
      minLengthTitle: 10,
      allowedPrefixes: ["Test"]
    };
    const mockLengthValidation = { isValid: true };
    const mockPrefixesValidation = { isValid: true };
    const validateInputsSpy = jest
      .spyOn(Validators.validateInputs, "validateInputs")
      .mockResolvedValue(mockInputs);
    const validateTitleLengthSpy = jest
      .spyOn(Validators.validateTitleLength, "validateTitleLength")
      .mockReturnValue(mockLengthValidation);
    const validateTitlePrefixesSpy = jest
      .spyOn(Validators.validateTitlePrefixes, "validateTitlePrefixes")
      .mockReturnValue(mockPrefixesValidation);
    const coreSetFailedSpy = jest.spyOn(core, "setFailed");
    const coreInfoSpy = jest.spyOn(core, "info");

    // Act
    await run();

    // Assert
    expect(validateInputsSpy).toHaveBeenCalledTimes(1);
    expect(validateTitleLengthSpy).toHaveBeenCalledWith("Test PR", 10, 100);
    expect(validateTitlePrefixesSpy).toHaveBeenCalledWith(
      "Test PR",
      ["Test"],
      true
    );
    expect(coreSetFailedSpy).not.toHaveBeenCalled();
    expect(coreInfoSpy).toHaveBeenCalledWith(
      "Pull Request title validation passed."
    );
  });
});
