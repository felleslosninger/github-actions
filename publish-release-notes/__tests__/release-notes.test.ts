import * as github from "@actions/github";
import { describe, it, jest, expect } from "@jest/globals";

import * as ReleaseNotes from "../src/release-notes";

describe("filterReleaseNotes", () => {
  it('should filter out items containing "(INTERNAL-COMMIT)"', () => {
    // arrange
    const releaseNotes = ["Bump version", "Add feature", "(INTERNAL-COMMIT)"];
    const ignoreCommits = "(INTERNAL-COMMIT)";
    const dependabotReplacement = "";
    const expected = ["Bump version", "Add feature"];

    // act
    const result = ReleaseNotes.filterReleaseNotes(
      releaseNotes,
      ignoreCommits,
      dependabotReplacement
    );

    // assert
    expect(result).toEqual(expect.arrayContaining(expected));
  });

  it('should replace "Bump" with "Library upgrades"', () => {
    // arrange
    const releaseNotes = ["Bump version to 1.2.3", "Add feature"];
    const ignoreCommits = "";
    const dependabotReplacement = "Library upgrades";
    const expected = ["Library upgrades", "Add feature"];

    // act
    const result = ReleaseNotes.filterReleaseNotes(
      releaseNotes,
      ignoreCommits,
      dependabotReplacement
    );

    // assert
    expect(result).toEqual(expect.arrayContaining(expected));
  });

  it('should replace all instances of "Bump" with single "Library upgrades"', () => {
    // arrange
    const releaseNotes = ["Bump version to 1.2.3", "Bump version to 2.0.0"];
    const ignoreCommits = "";
    const dependabotReplacement = "Library upgrades";
    const expected = ["Library upgrades"];

    // act
    const result = ReleaseNotes.filterReleaseNotes(
      releaseNotes,
      ignoreCommits,
      dependabotReplacement
    );

    // assert
    expect(result).toEqual(expect.arrayContaining(expected));
  });

  it("should not modify release notes if no match found", () => {
    const releaseNotes = ["Add feature", "Fix bug"];
    const ignoreCommits = "(INTERNAL-COMMIT)";
    const dependabotReplacement = "Library upgrades";
    const expected = ["Add feature", "Fix bug"];

    // act
    const result = ReleaseNotes.filterReleaseNotes(
      releaseNotes,
      ignoreCommits,
      dependabotReplacement
    );

    // assert
    expect(result).toEqual(expect.arrayContaining(expected));
  });

  it("should return empty array when empty array is supplied", () => {
    const releaseNotes: string[] = [];
    const ignoreCommits = "";
    const dependabotReplacement = "";
    const expected: string[] = [];

    // act
    const result = ReleaseNotes.filterReleaseNotes(
      releaseNotes,
      ignoreCommits,
      dependabotReplacement
    );

    // assert
    expect(result).toEqual(expect.arrayContaining(expected));
  });
});

describe("publishReleaseNotes", () => {
  it("should return false when releaseNotes is empty", async () => {
    // arrange
    const applicationName = "TestApp";
    const product = "TestProduct";
    const version = "1.0.0";
    const releaseNotes = [""];
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
    const releaseNotes = ["Test release notes"];
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
          createDispatchEvent: jest.fn().mockImplementation(async () => {})
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
    expect(
      github.getOctokit(githubToken).rest.repos.createDispatchEvent
    ).toHaveBeenCalledWith({
      owner: repositoryOwner,
      repo: repositoryName,
      event_type: eventType,
      client_payload: {
        "release-notes": '["Test release notes"]',
        "application-name": applicationName,
        product,
        version,
        date: timestamp,
        sha,
        title: publicTitle
      }
    });
    expect(result).toBe(true);
  });
});
