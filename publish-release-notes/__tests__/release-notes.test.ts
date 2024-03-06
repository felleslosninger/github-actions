import * as ReleaseNotes from "../src/release-notes";
import * as github from "@actions/github";

describe("filterReleaseNotes", () => {
  it('should filter out items containing "(INTERNAL-COMMIT)"', () => {
    // arrange
    const releaseNotes = "Bump version\nAdd feature\n(INTERNAL-COMMIT)";
    const ignoreCommits = "(INTERNAL-COMMIT)";
    const dependabotReplacement = "";
    const expected = "- Bump version\n- Add feature";

    // act
    const result = ReleaseNotes.filterReleaseNotes(
      releaseNotes,
      ignoreCommits,
      dependabotReplacement
    );

    // assert
    expect(result).toEqual(expected);
  });

  it('should replace "Bump" with "Library upgrades"', () => {
    // arrange
    const releaseNotes = "Bump version to 1.2.3\nAdd feature";
    const ignoreCommits = "";
    const dependabotReplacement = "Library upgrades";
    const expected = "- Library upgrades\n- Add feature";

    // act
    const result = ReleaseNotes.filterReleaseNotes(
      releaseNotes,
      ignoreCommits,
      dependabotReplacement
    );

    // assert
    expect(result).toEqual(expected);
  });

  it('should replace all instances of "Bump" with single "Library upgrades"', () => {
    // arrange
    const releaseNotes = "Bump version to 1.2.3\nBump version to 2.0.0";
    const ignoreCommits = "";
    const dependabotReplacement = "Library upgrades";
    const expected = "- Library upgrades";

    // act
    const result = ReleaseNotes.filterReleaseNotes(
      releaseNotes,
      ignoreCommits,
      dependabotReplacement
    );

    // assert
    expect(result).toEqual(expected);
  });

  it("should not modify release notes if no match found", () => {
    const releaseNotes = "Add feature\nFix bug";
    const ignoreCommits = "(INTERNAL-COMMIT)";
    const dependabotReplacement = "Library upgrades";
    const expected = "- Add feature\n- Fix bug";

    // act
    const result = ReleaseNotes.filterReleaseNotes(
      releaseNotes,
      ignoreCommits,
      dependabotReplacement
    );

    // assert
    expect(result).toEqual(expected);
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
    const ignoreCommits = "";
    const eventType = "";
    const dependabotReplacement = "";

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
      version,
      ignoreCommits,
      eventType,
      dependabotReplacement
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
    const ignoreCommits = "";
    const eventType = "";
    const dependabotReplacement = "";

    /* eslint-disable @typescript-eslint/no-explicit-any */
    jest.spyOn(github, "getOctokit").mockReturnValue({
      rest: {
        repos: {
          createDispatchEvent: jest.fn().mockResolvedValue(true)
        }
      }
    } as any);
    /* eslint-enable @typescript-eslint/no-explicit-any */

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
      version,
      ignoreCommits,
      eventType,
      dependabotReplacement
    );

    // assert
    expect(github.getOctokit).toHaveBeenCalledWith(githubToken);
    expect(result).toBe(true);
  });
});
