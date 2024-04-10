import ReleaseNotesClient from "../src/release-notes";
import * as github from "@actions/github";
import { describe, it, jest, beforeEach, expect } from "@jest/globals";
import { Commit } from "../src/interfaces";

let client: ReleaseNotesClient;

describe("ReleaseNotesClient", () => {
  describe("retrieveReleaseNotes", () => {
    beforeEach(() => {
      jest.clearAllMocks(); // Reset mock function calls before each test
    });

    it("should return release notes", async () => {
      // arrange
      const response = {
        data: {
          commits: [
            { commit: { message: "Commit message 1" } },
            { commit: { message: "Commit message 2" } }
          ]
        }
      };

      /* eslint-disable @typescript-eslint/no-explicit-any */
      jest.spyOn(github, "getOctokit").mockReturnValue({
        rest: {
          repos: {
            compareCommitsWithBasehead: jest
              .fn<() => Promise<any>>()
              .mockResolvedValue(response)
          }
        }
      } as any);
      /* eslint-enable @typescript-eslint/no-explicit-any */

      client = new ReleaseNotesClient(
        "repository",
        "base",
        "head",
        "githubToken"
      );

      // act
      const result = await client.retrieveReleaseNotes();

      // assert
      expect(result).toEqual([
        { message: "Commit message 2" },
        { message: "Commit message 1" }
      ]);
    });

    it("should throw an API error", async () => {
      // arrange
      const owner = "owner";
      const repo = "repo";
      const error = new Error("API error");

      /* eslint-disable @typescript-eslint/no-explicit-any */
      jest.spyOn(github, "getOctokit").mockReturnValue({
        rest: {
          repos: {
            compareCommitsWithBasehead: jest
              .fn<() => Promise<any>>()
              .mockRejectedValue(error)
          }
        }
      } as any);
      /* eslint-enable @typescript-eslint/no-explicit-any */

      const releaseNotesClient = new ReleaseNotesClient(
        `${owner}/${repo}`,
        "base",
        "head",
        "token"
      );

      // act & assert
      await expect(releaseNotesClient.retrieveReleaseNotes()).rejects.toThrow(
        `Failed to retrieve release notes: ${error.message}`
      );
    });

    it("should throw an unknown error", async () => {
      // arrange
      const owner = "owner";
      const repo = "repo";

      /* eslint-disable @typescript-eslint/no-explicit-any */
      jest.spyOn(github, "getOctokit").mockReturnValue({
        rest: {
          repos: {
            compareCommitsWithBasehead: jest
              .fn<() => Promise<any>>()
              .mockRejectedValue(undefined)
          }
        }
      } as any);
      /* eslint-enable @typescript-eslint/no-explicit-any */

      const releaseNotesClient = new ReleaseNotesClient(
        `${owner}/${repo}`,
        "base",
        "head",
        "token"
      );

      // act & assert
      await expect(releaseNotesClient.retrieveReleaseNotes()).rejects.toThrow(
        "Failed to retrieve release notes: Unknown error"
      );
    });
  });

  describe("extractFirstLineFromMessage", () => {
    beforeEach(() => {
      jest.clearAllMocks(); // Reset mock function calls before each test

      /* eslint-disable @typescript-eslint/no-explicit-any */
      jest.spyOn(github, "getOctokit").mockReturnValue({
        rest: {
          repos: {
            compareCommitsWithBasehead: jest
              .fn<() => Promise<any>>()
              .mockResolvedValue(true)
          }
        }
      } as any);
      /* eslint-enable @typescript-eslint/no-explicit-any */

      client = new ReleaseNotesClient(
        "repository",
        "base",
        "head",
        "githubToken"
      );
    });

    it("should return the first line of the commit message", () => {
      // arrange
      const message = "First line\nSecond line\nThird line";

      // act
      const result = client.extractFirstLineFromMessage(message);

      // assert
      expect(result).toEqual("First line");
    });

    it("should return the whole message if it only has one line", () => {
      // arrange
      const message = "Only one line";

      // act
      const result = client.extractFirstLineFromMessage(message);

      // assert
      expect(result).toEqual("Only one line");
    });

    it("should return an empty string if the message is empty", () => {
      // arrange
      const message = "";

      // act
      const result = client.extractFirstLineFromMessage(message);

      // assert
      expect(result).toEqual("");
    });

    it("should return an empty string if the message is null", () => {
      // arrange
      const message = null;

      // act
      const result = client.extractFirstLineFromMessage(message);

      // assert
      expect(result).toEqual("");
    });

    it("should return an empty string if the message is undefined", () => {
      // arrange
      const message = undefined;

      // act
      const result = client.extractFirstLineFromMessage(message);

      // assert
      expect(result).toEqual("");
    });
  });

  describe("sanitizeCommitMessages", () => {
    beforeEach(() => {
      jest.clearAllMocks(); // Reset mock function calls before each test

      /* eslint-disable @typescript-eslint/no-explicit-any */
      jest.spyOn(github, "getOctokit").mockReturnValue({
        rest: {
          repos: {
            compareCommitsWithBasehead: jest
              .fn<() => Promise<any>>()
              .mockResolvedValue(true)
          }
        }
      } as any);
      /* eslint-enable @typescript-eslint/no-explicit-any */

      client = new ReleaseNotesClient(
        "repository",
        "base",
        "head",
        "githubToken"
      );
    });

    it("should remove special characters from commit messages", () => {
      // arrange
      const commits = [
        { message: "Fix #123: Bug fix" },
        { message: 'Merge branch "feature-branch"' },
        { message: "Update README.md: Add new section" },
        { message: '§!"#$%&/()=?`^*@¨æøå' }
      ];

      // act
      const result = client.sanitizeCommitMessages(commits);

      // assert
      expect(result).toEqual([
        { message: "Fix #123: Bug fix" },
        { message: "Merge branch feature-branch" },
        { message: "Update README.md: Add new section" },
        { message: "#()æøå" }
      ]);
    });

    it("should handle empty commit messages", () => {
      // arrange
      const commits = [{ message: "" }, { message: " " }];

      // act
      const result = client.sanitizeCommitMessages(commits);

      // assert
      expect(result).toEqual([{ message: "" }, { message: " " }]);
    });

    it("should handle commits with no special characters", () => {
      // arrange
      const commits = [
        { message: "Initial commit" },
        { message: "Update dependencies" },
        { message: "Refactor code" }
      ];

      // act
      const result = client.sanitizeCommitMessages(commits);

      // assert
      expect(result).toEqual([
        { message: "Initial commit" },
        { message: "Update dependencies" },
        { message: "Refactor code" }
      ]);
    });
  });

  describe("extractFirstLineFromCommits", () => {
    beforeEach(() => {
      jest.clearAllMocks(); // Reset mock function calls before each test

      /* eslint-disable @typescript-eslint/no-explicit-any */
      jest.spyOn(github, "getOctokit").mockReturnValue({
        rest: {
          repos: {
            compareCommitsWithBasehead: jest
              .fn<() => Promise<any>>()
              .mockResolvedValue(true)
          }
        }
      } as any);
      /* eslint-enable @typescript-eslint/no-explicit-any */

      client = new ReleaseNotesClient(
        "repository",
        "base",
        "head",
        "githubToken"
      );
    });

    it("should remove everything after first line", () => {
      // arrange
      const commits = [
        {
          message:
            "Fix #123: Bug fix\nShould be removed\nShould also be removed"
        },
        { message: "Update README.md: Add new section\nShould be removed" }
      ];

      // act
      const result = client.extractFirstLineFromCommits(commits);

      // assert
      expect(result).toEqual([
        { message: "Fix #123: Bug fix" },
        { message: "Update README.md: Add new section" }
      ]);
    });

    it("should handle empty commit messages", () => {
      // arrange
      const commits = [{ message: "" }, { message: " \n\n\n" }];

      // act
      const result = client.extractFirstLineFromCommits(commits);

      // assert
      expect(result).toEqual([{ message: "" }, { message: " " }]);
    });
  });

  describe("retrieveCommitMessage", () => {
    beforeEach(() => {
      jest.clearAllMocks(); // Reset mock function calls before each test
    });

    it("should return the commit message", async () => {
      // arrange
      const owner = "owner";
      const repo = "repo";
      const ref = "ref";
      const message = "Commit message\n\nShould be removed";
      const token = "token";
      const response = {
        data: {
          commit: {
            message
          }
        }
      };

      /* eslint-disable @typescript-eslint/no-explicit-any */
      jest.spyOn(github, "getOctokit").mockReturnValue({
        rest: {
          repos: {
            getCommit: jest.fn<() => Promise<any>>().mockResolvedValue(response)
          }
        }
      } as any);
      /* eslint-enable @typescript-eslint/no-explicit-any */

      const releaseNotesClient = new ReleaseNotesClient(
        `${owner}/${repo}`,
        "base",
        "head",
        "token"
      );

      // act
      const result = await releaseNotesClient.retrieveCommitMessage(ref);

      // assert
      expect(result).toEqual("Commit message");
      expect(
        github.getOctokit(token).rest.repos.getCommit
      ).toHaveBeenCalledWith({
        owner,
        repo,
        ref
      });
    });

    it("should throw an API error if unable to retrieve the commit message", async () => {
      // arrange
      const owner = "owner";
      const repo = "repo";
      const ref = "ref";
      const error = new Error("API error");

      /* eslint-disable @typescript-eslint/no-explicit-any */
      jest.spyOn(github, "getOctokit").mockReturnValue({
        rest: {
          repos: {
            getCommit: jest.fn<() => Promise<any>>().mockRejectedValue(error)
          }
        }
      } as any);
      /* eslint-enable @typescript-eslint/no-explicit-any */

      const releaseNotesClient = new ReleaseNotesClient(
        `${owner}/${repo}`,
        "base",
        "head",
        "token"
      );

      // act & Assert
      await expect(
        releaseNotesClient.retrieveCommitMessage(ref)
      ).rejects.toThrow(
        `Failed to retrieve commit message for ref ${ref}: ${error.message}`
      );
    });

    it("should throw an unknown error if unable to retrieve the commit message", async () => {
      // arrange
      const owner = "owner";
      const repo = "repo";
      const ref = "ref";
      const error = "Not an error";

      /* eslint-disable @typescript-eslint/no-explicit-any */
      jest.spyOn(github, "getOctokit").mockReturnValue({
        rest: {
          repos: {
            getCommit: jest.fn<() => Promise<any>>().mockRejectedValue(error)
          }
        }
      } as any);
      /* eslint-enable @typescript-eslint/no-explicit-any */

      const releaseNotesClient = new ReleaseNotesClient(
        `${owner}/${repo}`,
        "base",
        "head",
        "token"
      );

      // act & Assert
      await expect(
        releaseNotesClient.retrieveCommitMessage(ref)
      ).rejects.toThrow(
        `Failed to retrieve commit message for ref ${ref}: Unknown error`
      );
    });
  });

  describe("generateReleaseLog", () => {
    it("should return commits in reverse order when list of commits is provided", async () => {
      // arrange
      const commits = [
        { message: "Commit message 2" },
        { message: "Commit message 1" }
      ];

      // act
      const results = await client.generateReleaseLog(commits);

      // assert
      expect(results).toEqual([
        { message: "Commit message 1" },
        { message: "Commit message 2" }
      ]);
    });

    it("should return head commit when no commits are provided", async () => {
      // arrange
      const commits: Commit[] = [];
      const owner = "owner";
      const repo = "repo";
      const message = "Head commit message";
      const response = {
        data: {
          commit: {
            message
          }
        }
      };

      /* eslint-disable @typescript-eslint/no-explicit-any */
      jest.spyOn(github, "getOctokit").mockReturnValue({
        rest: {
          repos: {
            getCommit: jest.fn<() => Promise<any>>().mockResolvedValue(response)
          }
        }
      } as any);
      /* eslint-enable @typescript-eslint/no-explicit-any */

      const releaseNotesClient = new ReleaseNotesClient(
        `${owner}/${repo}`,
        "base",
        "head",
        "token"
      );

      // act
      const results = await releaseNotesClient.generateReleaseLog(commits);

      // assert
      expect(results).toEqual([{ message: "Head commit message" }]);
    });

    it("should throw an unknown error if unable to retrieve the commit message", async () => {
      // arrange
      const owner = "owner";
      const repo = "repo";
      const error = "Not an error";
      const commits: Commit[] = [];

      /* eslint-disable @typescript-eslint/no-explicit-any */
      jest.spyOn(github, "getOctokit").mockReturnValue({
        rest: {
          repos: {
            getCommit: jest.fn<() => Promise<any>>().mockRejectedValue(error)
          }
        }
      } as any);
      /* eslint-enable @typescript-eslint/no-explicit-any */

      const releaseNotesClient = new ReleaseNotesClient(
        `${owner}/${repo}`,
        "base",
        "head",
        "token"
      );

      // act & Assert
      await expect(
        releaseNotesClient.generateReleaseLog(commits)
      ).rejects.toThrow(
        "Failed to create release log: Failed to retrieve commit message for ref head: Unknown error"
      );
    });

    it("should throw an error if unable to retrieve the commit message", async () => {
      // arrange
      const owner = "owner";
      const repo = "repo";
      const error = Error("Something went wrong");
      const commits: Commit[] = [];

      /* eslint-disable @typescript-eslint/no-explicit-any */
      jest.spyOn(github, "getOctokit").mockReturnValue({
        rest: {
          repos: {
            getCommit: jest.fn<() => Promise<any>>().mockRejectedValue(error)
          }
        }
      } as any);
      /* eslint-enable @typescript-eslint/no-explicit-any */

      const releaseNotesClient = new ReleaseNotesClient(
        `${owner}/${repo}`,
        "base",
        "head",
        "token"
      );

      // act & assert
      await expect(
        releaseNotesClient.generateReleaseLog(commits)
      ).rejects.toThrow(
        "Failed to create release log: Failed to retrieve commit message for ref head: Something went wrong"
      );
    });

    it("should throw an unknown error if retrieveReleaseLogEntry fails", async () => {
      // arrange
      const owner = "owner";
      const repo = "repo";
      const commits: Commit[] = [];

      const releaseNotesClient = new ReleaseNotesClient(
        `${owner}/${repo}`,
        "base",
        "head",
        "token"
      );

      jest
        .spyOn(releaseNotesClient, "retrieveReleaseLogEntry")
        .mockRejectedValue(undefined);

      // act & assert
      await expect(
        releaseNotesClient.generateReleaseLog(commits)
      ).rejects.toThrow("Failed to create release log: Unknown error");
    });
  });
});
