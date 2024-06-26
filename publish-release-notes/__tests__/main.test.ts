import * as core from "@actions/core";
import { describe, it, jest, expect, beforeEach } from "@jest/globals";

import { run } from "../src/main";
import * as InputsHelpers from "../src/helpers/inputs-helper";
import * as ReleaseNotes from "../src/release-notes";

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

  it("should call publishReleaseNotes if releaseNotes is not empty", async () => {
    // arrange
    jest.spyOn(InputsHelpers, "loadInputs").mockImplementation(() => ({
      applicationName: "TestApp",
      product: "TestProduct",
      version: "1.0.0",
      releaseNotes: ["Test release notes"],
      timestamp: "2024-02-29T12:00:00Z",
      githubToken: "test_token",
      repositoryOwner: "test_owner",
      repositoryName: "test_repo",
      sha: "test_sha",
      allowProducts: "",
      allowApplications: "",
      ignoreProducts: "",
      ignoreApplications: "",
      title: "TestTitle",
      eventType: "TestEvent",
      dependabotReplacement: "",
      ignoreCommits: ""
    }));

    jest.spyOn(ReleaseNotes, "publishReleaseNotes").mockResolvedValue(true);

    jest.spyOn(core, "setOutput");

    // act
    await run();

    // assert
    expect(ReleaseNotes.publishReleaseNotes).toHaveBeenCalledWith(
      "TestApp",
      "2024-02-29T12:00:00Z",
      "test_token",
      "TestProduct",
      ["Test release notes"],
      "test_repo",
      "test_owner",
      "test_sha",
      "TestTitle",
      "1.0.0",
      "",
      "TestEvent",
      ""
    );

    expect(core.setOutput).toHaveBeenCalledWith(
      "release-notes-created",
      "true"
    );
  });

  it("should not call publishReleaseNotes if releaseNotes is empty", async () => {
    // arrange
    jest.spyOn(InputsHelpers, "loadInputs").mockImplementation(() => ({
      applicationName: "TestApp",
      product: "TestProduct",
      version: "1.0.0",
      releaseNotes: [""],
      timestamp: "2024-02-29T12:00:00Z",
      githubToken: "test_token",
      repositoryOwner: "test_owner",
      repositoryName: "test_repo",
      sha: "test_sha",
      allowProducts: "",
      allowApplications: "",
      ignoreProducts: "",
      ignoreApplications: "",
      title: "TestTitle",
      eventType: "TestEvent",
      dependabotReplacement: "",
      ignoreCommits: ""
    }));

    jest.spyOn(ReleaseNotes, "publishReleaseNotes").mockResolvedValue(true);

    jest.spyOn(core, "setOutput");
    jest.spyOn(core, "info");

    // act
    await run();

    // assert
    expect(ReleaseNotes.publishReleaseNotes).not.toHaveBeenCalled();
    expect(core.info).toHaveBeenCalled();
    expect(core.setOutput).toHaveBeenCalledWith(
      "release-notes-created",
      "false"
    );
  });

  it("should not call publishReleaseNotes if product is ignored", async () => {
    // arrange
    jest.spyOn(InputsHelpers, "loadInputs").mockImplementation(() => ({
      applicationName: "TestApp",
      product: "IgnoredProduct", // Set to a product to be ignored
      version: "1.0.0",
      releaseNotes: ["Test release notes"],
      timestamp: "2024-02-29T12:00:00Z",
      githubToken: "test_token",
      repositoryOwner: "test_owner",
      repositoryName: "test_repo",
      sha: "test_sha",
      allowProducts: "",
      allowApplications: "",
      ignoreProducts: "IgnoredProduct", // Ignoring this product
      ignoreApplications: "",
      title: "TestTitle",
      eventType: "TestEvent",
      dependabotReplacement: "",
      ignoreCommits: ""
    }));

    jest.spyOn(ReleaseNotes, "publishReleaseNotes").mockResolvedValue(true);

    jest.spyOn(core, "setOutput");

    // act
    await run();

    // assert
    expect(ReleaseNotes.publishReleaseNotes).not.toHaveBeenCalled();

    expect(core.setOutput).toHaveBeenCalledWith(
      "release-notes-created",
      "false"
    );
  });

  it("should not call publishReleaseNotes if application is ignored", async () => {
    // arrange
    jest.spyOn(InputsHelpers, "loadInputs").mockImplementation(() => ({
      applicationName: "IgnoredApp",
      product: "TestProduct",
      version: "1.0.0",
      releaseNotes: ["Test release notes"],
      timestamp: "2024-02-29T12:00:00Z",
      githubToken: "test_token",
      repositoryOwner: "test_owner",
      repositoryName: "test_repo",
      sha: "test_sha",
      allowApplications: "",
      allowProducts: "",
      ignoreProducts: "",
      ignoreApplications: "IgnoredApp",
      title: "TestTitle",
      eventType: "TestEvent",
      dependabotReplacement: "",
      ignoreCommits: ""
    }));

    jest.spyOn(ReleaseNotes, "publishReleaseNotes").mockResolvedValue(true);

    jest.spyOn(core, "setOutput");

    // act
    await run();

    // assert
    expect(ReleaseNotes.publishReleaseNotes).not.toHaveBeenCalled();

    expect(core.setOutput).toHaveBeenCalledWith(
      "release-notes-created",
      "false"
    );
  });

  it("should call publishReleaseNotes if product is allowed", async () => {
    // arrange
    jest.spyOn(InputsHelpers, "loadInputs").mockImplementation(() => ({
      applicationName: "TestApp",
      product: "AllowedProduct",
      version: "1.0.0",
      releaseNotes: ["Test release notes"],
      timestamp: "2024-02-29T12:00:00Z",
      githubToken: "test_token",
      repositoryOwner: "test_owner",
      repositoryName: "test_repo",
      sha: "test_sha",
      allowProducts: "AllowedProduct,AnotherProduct",
      allowApplications: "",
      ignoreProducts: "",
      ignoreApplications: "",
      title: "TestTitle",
      eventType: "TestEvent",
      dependabotReplacement: "",
      ignoreCommits: ""
    }));

    jest.spyOn(ReleaseNotes, "publishReleaseNotes").mockResolvedValue(true);

    jest.spyOn(core, "setOutput");

    // act
    await run();

    // assert
    expect(ReleaseNotes.publishReleaseNotes).toHaveBeenCalledWith(
      "TestApp",
      "2024-02-29T12:00:00Z",
      "test_token",
      "AllowedProduct",
      ["Test release notes"],
      "test_repo",
      "test_owner",
      "test_sha",
      "TestTitle",
      "1.0.0",
      "",
      "TestEvent",
      ""
    );

    expect(core.setOutput).toHaveBeenCalledWith(
      "release-notes-created",
      "true"
    );
  });

  it("should not call publishReleaseNotes if product is not allowed", async () => {
    // arrange
    jest.spyOn(InputsHelpers, "loadInputs").mockImplementation(() => ({
      applicationName: "TestApp",
      product: "NotAllowedProduct",
      version: "1.0.0",
      releaseNotes: ["Test release notes"],
      timestamp: "2024-02-29T12:00:00Z",
      githubToken: "test_token",
      repositoryOwner: "test_owner",
      repositoryName: "test_repo",
      sha: "test_sha",
      allowProducts: "AllowedProduct,AnotherProduct",
      allowApplications: "",
      ignoreProducts: "",
      ignoreApplications: "",
      title: "TestTitle",
      eventType: "TestEvent",
      dependabotReplacement: "",
      ignoreCommits: ""
    }));

    jest.spyOn(ReleaseNotes, "publishReleaseNotes").mockResolvedValue(true);

    jest.spyOn(core, "setOutput");
    jest.spyOn(core, "info");

    // act
    await run();

    // assert
    expect(ReleaseNotes.publishReleaseNotes).not.toHaveBeenCalled();
    expect(core.info).toHaveBeenCalled();
    expect(core.setOutput).toHaveBeenCalledWith(
      "release-notes-created",
      "false"
    );
  });

  it("should call publishReleaseNotes if application is allowed", async () => {
    // arrange
    jest.spyOn(InputsHelpers, "loadInputs").mockImplementation(() => ({
      applicationName: "AllowedApp",
      product: "TestProduct",
      version: "1.0.0",
      releaseNotes: ["Test release notes"],
      timestamp: "2024-02-29T12:00:00Z",
      githubToken: "test_token",
      repositoryOwner: "test_owner",
      repositoryName: "test_repo",
      sha: "test_sha",
      allowApplications: "AllowedApp,AnotherApp",
      allowProducts: "",
      ignoreProducts: "",
      ignoreApplications: "",
      title: "TestTitle",
      eventType: "TestEvent",
      dependabotReplacement: "",
      ignoreCommits: ""
    }));

    jest.spyOn(ReleaseNotes, "publishReleaseNotes").mockResolvedValue(true);

    jest.spyOn(core, "setOutput");

    // act
    await run();

    // assert
    expect(ReleaseNotes.publishReleaseNotes).toHaveBeenCalledWith(
      "AllowedApp",
      "2024-02-29T12:00:00Z",
      "test_token",
      "TestProduct",
      ["Test release notes"],
      "test_repo",
      "test_owner",
      "test_sha",
      "TestTitle",
      "1.0.0",
      "",
      "TestEvent",
      ""
    );

    expect(core.setOutput).toHaveBeenCalledWith(
      "release-notes-created",
      "true"
    );
  });

  it("should not call publishReleaseNotes if application is not allowed", async () => {
    // arrange
    jest.spyOn(InputsHelpers, "loadInputs").mockImplementation(() => ({
      applicationName: "NotAllowedApp",
      product: "TestProduct",
      version: "1.0.0",
      releaseNotes: ["Test release notes"],
      timestamp: "2024-02-29T12:00:00Z",
      githubToken: "test_token",
      repositoryOwner: "test_owner",
      repositoryName: "test_repo",
      sha: "test_sha",
      allowApplications: "AllowedApp,AnotherApp",
      allowProducts: "",
      ignoreProducts: "",
      ignoreApplications: "",
      title: "TestTitle",
      eventType: "TestEvent",
      dependabotReplacement: "",
      ignoreCommits: ""
    }));

    jest.spyOn(ReleaseNotes, "publishReleaseNotes").mockResolvedValue(true);

    jest.spyOn(core, "setOutput");
    jest.spyOn(core, "info");

    // act
    await run();

    // assert
    expect(ReleaseNotes.publishReleaseNotes).not.toHaveBeenCalled();
    expect(core.info).toHaveBeenCalled();
    expect(core.setOutput).toHaveBeenCalledWith(
      "release-notes-created",
      "false"
    );
  });
});
