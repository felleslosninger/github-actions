import { run } from "../src/main";
import * as core from "@actions/core";
import { InputsHelpers } from "../src/helpers/inputs-helper";
import { ReleaseNotes } from "../src/release-notes";
import { DispatchEvent } from "../src/dispatch-event";

describe("run", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mock function calls before each test
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

  it("should call publishReleaseNotes if isPublic is true", async () => {
    // arrange
    jest.spyOn(InputsHelpers, "loadInputs").mockImplementation(() => ({
      applicationName: "TestApp",
      product: "TestProduct",
      version: "1.0.0",
      releaseNotes: "Test release notes",
      timestamp: "2024-02-29T12:00:00Z",
      githubToken: "test_token",
      repositoryOwner: "test_owner",
      repositoryName: "test_repo",
      sha: "test_sha",
      isPublic: true,
      publicIgnoreProducts: "",
      publicIgnoreApplications: "",
      publicTitle: "TestTitle"
    }));

    jest.spyOn(ReleaseNotes, "publishReleaseNotes").mockResolvedValue(true);

    jest.spyOn(DispatchEvent, "send").mockResolvedValue();

    jest.spyOn(core, "setOutput");

    // act
    await run();

    // assert
    expect(ReleaseNotes.publishReleaseNotes).toHaveBeenCalledWith(
      "TestApp",
      "2024-02-29T12:00:00Z",
      "test_token",
      "TestProduct",
      "Test release notes",
      "test_repo",
      "test_owner",
      "test_sha",
      "TestTitle",
      "1.0.0"
    );

    expect(DispatchEvent.send).toHaveBeenCalled();

    expect(core.setOutput).toHaveBeenCalledWith(
      "release-notes-created",
      "true"
    );
  });

  it("should not call publishReleaseNotes if isPublic is false", async () => {
    // arrange
    jest.spyOn(InputsHelpers, "loadInputs").mockImplementation(() => ({
      applicationName: "TestApp",
      product: "TestProduct",
      version: "1.0.0",
      releaseNotes: "Test release notes",
      timestamp: "2024-02-29T12:00:00Z",
      githubToken: "test_token",
      repositoryOwner: "test_owner",
      repositoryName: "test_repo",
      sha: "test_sha",
      isPublic: false,
      publicIgnoreProducts: "",
      publicIgnoreApplications: "",
      publicTitle: "TestTitle"
    }));

    jest.spyOn(ReleaseNotes, "publishReleaseNotes").mockResolvedValue(true);

    jest.spyOn(DispatchEvent, "send").mockResolvedValue();

    jest.spyOn(core, "setOutput");

    // act
    await run();

    // assert
    expect(ReleaseNotes.publishReleaseNotes).not.toHaveBeenCalled();

    expect(DispatchEvent.send).toHaveBeenCalled();

    expect(core.setOutput).toHaveBeenCalledWith(
      "release-notes-created",
      "false"
    );
  });

  it("should not call publishReleaseNotes if product or application is ignored", async () => {
    // arrange
    jest.spyOn(InputsHelpers, "loadInputs").mockImplementation(() => ({
      applicationName: "TestApp",
      product: "IgnoredProduct", // Set to a product to be ignored
      version: "1.0.0",
      releaseNotes: "Test release notes",
      timestamp: "2024-02-29T12:00:00Z",
      githubToken: "test_token",
      repositoryOwner: "test_owner",
      repositoryName: "test_repo",
      sha: "test_sha",
      isPublic: true,
      publicIgnoreProducts: "IgnoredProduct", // Ignoring this product
      publicIgnoreApplications: "",
      publicTitle: "TestTitle"
    }));

    jest.spyOn(ReleaseNotes, "publishReleaseNotes").mockResolvedValue(true);

    jest.spyOn(DispatchEvent, "send").mockResolvedValue();

    jest.spyOn(core, "setOutput");

    // act
    await run();

    // assert
    expect(ReleaseNotes.publishReleaseNotes).not.toHaveBeenCalled();

    expect(DispatchEvent.send).toHaveBeenCalled();

    expect(core.setOutput).toHaveBeenCalledWith(
      "release-notes-created",
      "false"
    );
  });

  it("should handle empty release notes", async () => {
    // arrange
    jest.spyOn(core, "setOutput"); // Since we're not expecting release-notes-created to be set

    // Mock loadInputs to return empty release notes
    jest.spyOn(InputsHelpers, "loadInputs").mockReturnValue({
      applicationName: "TestApp",
      product: "TestProduct",
      version: "1.0.0",
      releaseNotes: "", // Empty release notes
      timestamp: "2024-02-29T12:00:00Z",
      githubToken: "test_token",
      repositoryOwner: "test_owner",
      repositoryName: "test_repo",
      sha: "test_sha",
      isPublic: true,
      publicIgnoreProducts: "",
      publicIgnoreApplications: "",
      publicTitle: "TestTitle"
    });

    // act
    await run();

    // assert
    expect(ReleaseNotes.publishReleaseNotes).not.toHaveBeenCalled();

    expect(DispatchEvent.send).not.toHaveBeenCalled();

    expect(core.setOutput).toHaveBeenCalledWith(
      "release-notes-created",
      "false"
    );
  });
});
