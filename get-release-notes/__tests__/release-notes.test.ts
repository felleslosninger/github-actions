import { ReleaseNotesClient } from "../src/release-notes";
import * as github from "@actions/github";

let client: ReleaseNotesClient;

describe("ReleaseNotesClient", () => {
  describe("getFirstCommitLine", () => {
    beforeEach(() => {
      jest.clearAllMocks(); // Reset mock function calls before each test

      /* eslint-disable @typescript-eslint/no-explicit-any */
      jest.spyOn(github, "getOctokit").mockReturnValue({
        rest: {
          repos: {
            createDispatchEvent: jest.fn().mockResolvedValue(true)
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
});
