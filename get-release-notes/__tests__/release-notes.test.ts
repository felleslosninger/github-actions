import ReleaseNotesClient from "../src/release-notes";
import * as github from "@actions/github";
import { describe, it, jest, beforeEach, expect } from "@jest/globals";
import { Commit } from "../src/interfaces";

let client: ReleaseNotesClient;

describe("ReleaseNotesClient", () => {
  describe("getReleaseNotes", () => {
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
      const result = await client.getReleaseNotes();

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
      await expect(releaseNotesClient.getReleaseNotes()).rejects.toThrow(
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
      await expect(releaseNotesClient.getReleaseNotes()).rejects.toThrow(
        "Failed to retrieve release notes: Unknown error"
      );
    });
  });

  describe("getFirstCommitLine", () => {
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
      // Arrange
      const message = "First line\nSecond line\nThird line";

      // Act
      const result = client.getFirstCommitLine(message);

      // Assert
      expect(result).toEqual("First line");
    });

    it("should return the whole message if it only has one line", () => {
      // Arrange
      const message = "Only one line";

      // Act
      const result = client.getFirstCommitLine(message);

      // Assert
      expect(result).toEqual("Only one line");
    });

    it("should return an empty string if the message is empty", () => {
      // Arrange
      const message = "";

      // Act
      const result = client.getFirstCommitLine(message);

      // Assert
      expect(result).toEqual("");
    });

    it("should return an empty string if the message is null", () => {
      // Arrange
      const message = null;

      // Act
      const result = client.getFirstCommitLine(message);

      // Assert
      expect(result).toEqual("");
    });

    it("should return an empty string if the message is undefined", () => {
      // Arrange
      const message = undefined;

      // Act
      const result = client.getFirstCommitLine(message);

      // Assert
      expect(result).toEqual("");
    });
  });

  describe("removeSpecialCharacters", () => {
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
      // Arrange
      const commits = [
        { message: "Fix #123: Bug fix" },
        { message: 'Merge branch "feature-branch"' },
        { message: "Update README.md: Add new section" },
        { message: '§!"#$%&/()=?`^*@¨æøå' }
      ];

      // Act
      const result = client.removeSpecialCharacters(commits);

      // Assert
      expect(result).toEqual([
        { message: "Fix #123: Bug fix" },
        { message: "Merge branch feature-branch" },
        { message: "Update README.md: Add new section" },
        { message: "#()æøå" }
      ]);
    });

    it("should handle empty commit messages", () => {
      // Arrange
      const commits = [{ message: "" }, { message: " " }];

      // Act
      const result = client.removeSpecialCharacters(commits);

      // Assert
      expect(result).toEqual([{ message: "" }, { message: " " }]);
    });

    it("should handle commits with no special characters", () => {
      // Arrange
      const commits = [
        { message: "Initial commit" },
        { message: "Update dependencies" },
        { message: "Refactor code" }
      ];

      // Act
      const result = client.removeSpecialCharacters(commits);

      // Assert
      expect(result).toEqual([
        { message: "Initial commit" },
        { message: "Update dependencies" },
        { message: "Refactor code" }
      ]);
    });
  });

  describe("trimCommitMessages", () => {
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
      // Arrange
      const commits = [
        {
          message:
            "Fix #123: Bug fix\nShould be removed\nShould also be removed"
        },
        { message: "Update README.md: Add new section\nShould be removed" }
      ];

      // Act
      const result = client.trimCommitMessages(commits);

      // Assert
      expect(result).toEqual([
        { message: "Fix #123: Bug fix" },
        { message: "Update README.md: Add new section" }
      ]);
    });

    it("should handle empty commit messages", () => {
      // Arrange
      const commits = [{ message: "" }, { message: " \n\n\n" }];

      // Act
      const result = client.trimCommitMessages(commits);

      // Assert
      expect(result).toEqual([{ message: "" }, { message: " " }]);
    });
  });

  describe("getCommitMessage", () => {
    beforeEach(() => {
      jest.clearAllMocks(); // Reset mock function calls before each test
    });

    it("should return the commit message", async () => {
      // Arrange
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

      // Act
      const result = await releaseNotesClient.getCommitMessage(ref);

      // Assert
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
      // Arrange
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

      // Act & Assert
      await expect(releaseNotesClient.getCommitMessage(ref)).rejects.toThrow(
        `Failed to retrieve commit message for ref ${ref}: ${error.message}`
      );
    });

    it("should throw an unknown error if unable to retrieve the commit message", async () => {
      // Arrange
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

      // Act & Assert
      await expect(releaseNotesClient.getCommitMessage(ref)).rejects.toThrow(
        `Failed to retrieve commit message for ref ${ref}: Unknown error`
      );
    });
  });

  describe("createReleaseLog", () => {
    it("should return commits in reverse order when list of commits is provided", async () => {
      // arrange
      const commits = [
        { message: "Commit message 2" },
        { message: "Commit message 1" }
      ];

      // act
      const results = await client.createReleaseLog(commits);

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
      const results = await releaseNotesClient.createReleaseLog(commits);

      // assert
      expect(results).toEqual([{ message: "Head commit message" }]);
    });

    it("should throw an unknown error if unable to retrieve the commit message", async () => {
      // Arrange
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

      // Act & Assert
      await expect(
        releaseNotesClient.createReleaseLog(commits)
      ).rejects.toThrow(
        "Failed to create release log: Failed to retrieve commit message for ref head: Unknown error"
      );
    });
  });

  it("should throw an error if unable to retrieve the commit message", async () => {
    // Arrange
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

    // Act & Assert
    await expect(releaseNotesClient.createReleaseLog(commits)).rejects.toThrow(
      "Failed to create release log: Failed to retrieve commit message for ref head: Something went wrong"
    );
  });

  it("should throw an unknown error if getReleaseLogEntry fails", async () => {
    // Arrange
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
      .spyOn(releaseNotesClient, "getReleaseLogEntry")
      .mockRejectedValue(undefined);

    // Act & Assert
    await expect(releaseNotesClient.createReleaseLog(commits)).rejects.toThrow(
      "Failed to create release log: Unknown error"
    );
  });
});
