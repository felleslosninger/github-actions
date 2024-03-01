import { run } from "../src/main";
import * as core from "@actions/core";
import * as github from "@actions/github";
import { publishReleaseNotes } from "../src/release-notes";

// Mocking the loadInputs function
jest.mock("../src/helpers/inputs-helper", () => ({
  loadInputs: jest.fn(() => ({
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
    publicIgnoreProducts: [],
    publicIgnoreApplications: [],
    publicTitle: "TestTitle"
  }))
}));

// Mocking the publishReleaseNotes function
jest.mock("../src/release-notes", () => ({
  publishReleaseNotes: jest.fn()
}));

describe("run", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mock function calls before each test
  });

  it("should handle errors", async () => {
    const errorMessage = "Test error";
    const mockSetFailed = jest
      .spyOn(core, "setFailed")
      .mockImplementationOnce(() => {});
    jest.spyOn(github, "getOctokit").mockImplementationOnce(() => {
      throw new Error(errorMessage);
    });
    await run();
    expect(mockSetFailed).toHaveBeenCalledWith(errorMessage);
  });

  it("should call publishReleaseNotes if isPublic is true", async () => {
    await run();
    expect(publishReleaseNotes).toHaveBeenCalledWith(
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
  });
});
