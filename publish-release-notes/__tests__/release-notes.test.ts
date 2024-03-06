import { ReleaseNotes } from "../src/release-notes";
import * as github from "@actions/github";

describe("filterReleaseNotes", () => {
  it('should filter out items containing "(INTERNAL-COMMIT)"', () => {
    const releaseNotes = "Bump version\nAdd feature\n(INTERNAL-COMMIT)";
    const expected = "- Library upgrades\n- Add feature";
    expect(ReleaseNotes.filterReleaseNotes(releaseNotes)).toEqual(expected);
  });

  it('should replace "Bump" with "Library upgrades"', () => {
    const releaseNotes = "Bump version to 1.2.3\nAdd feature";
    const expected = "- Library upgrades\n- Add feature";
    expect(ReleaseNotes.filterReleaseNotes(releaseNotes)).toEqual(expected);
  });

  it('should replace all instances of "Bump"', () => {
    const releaseNotes = "Bump version to 1.2.3\nBump version to 2.0.0";
    const expected = "- Library upgrades";
    expect(ReleaseNotes.filterReleaseNotes(releaseNotes)).toEqual(expected);
  });

  it("should not modify release notes if no match found", () => {
    const releaseNotes = "Add feature\nFix bug";
    const expected = "- Add feature\n- Fix bug";
    expect(ReleaseNotes.filterReleaseNotes(releaseNotes)).toEqual(expected);
  });
});

describe("publishReleaseNotes", () => {
  it("should return false when releaseNotes is empty", async () => {
    // arrange
    const applicationName = "TestApp";
    const product = "TestProduct";
    const version = "1.0.0";
    const releaseNotes = "";
    const timestamp = "2024-02-29T12:00:00Z";
    const githubToken = "test_token";
    const repositoryOwner = "test_owner";
    const repositoryName = "test_repo";
    const sha = "test_sha";
    const publicTitle = "TestTitle";

    // act
    const result = await ReleaseNotes.publishReleaseNotes(
      applicationName,
      timestamp,
      githubToken,
      product,
      releaseNotes,
      repositoryName,
      repositoryOwner,
      sha,
      publicTitle,
      version
    );

    // assert
    expect(result).toBe(false);
  });

  it("should return true when success", async () => {
    // arrange
    const applicationName = "TestApp";
    const product = "TestProduct";
    const version = "1.0.0";
    const releaseNotes = "Test release notes";
    const timestamp = "2024-02-29T12:00:00Z";
    const githubToken = "test_token";
    const repositoryOwner = "test_owner";
    const repositoryName = "test_repo";
    const sha = "test_sha";
    const publicTitle = "TestTitle";

    jest.spyOn(github, "getOctokit").mockReturnValue({
      rest: {
        repos: {
          createDispatchEvent: jest.fn().mockResolvedValue(true)
        }
      }
    } as any);

    jest.spyOn(ReleaseNotes, "filterReleaseNotes");

    // act
    const result = await ReleaseNotes.publishReleaseNotes(
      applicationName,
      timestamp,
      githubToken,
      product,
      releaseNotes,
      repositoryName,
      repositoryOwner,
      sha,
      publicTitle,
      version
    );

    // assert
    expect(github.getOctokit).toHaveBeenCalledWith(githubToken);
    expect(ReleaseNotes.filterReleaseNotes).toHaveBeenCalledWith(releaseNotes);
    expect(result).toBe(true);
  });
});
