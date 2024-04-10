import * as github from "@actions/github";
import { Commit, ComparisonResponse } from "./interfaces";
import type { RestEndpointMethods } from "@octokit/plugin-rest-endpoint-methods/dist-types/generated/method-types";

/**
 * ReleaseNotesClient is a class responsible for retrieving release notes from a GitHub repository.
 */
export default class ReleaseNotesClient {
  private api: RestEndpointMethods;
  private githubToken: string;
  private owner: string;
  private repo: string;
  private head: string;
  private base: string;

  /**
   * Constructs a new ReleaseNotesClient instance.
   * @param repository The GitHub repository in the format "owner/repo".
   * @param base The base branch or tag for comparison.
   * @param head The head branch or tag for comparison.
   * @param githubToken The GitHub authentication token.
   */
  constructor(
    repository: string,
    base: string,
    head: string,
    githubToken: string
  ) {
    [this.owner, this.repo] = repository.split("/");
    this.githubToken = githubToken;
    this.base = base;
    this.head = head;
    this.api = github.getOctokit(this.githubToken).rest;
  }

  /**
   * Retrieves the release notes between the base and head commits.
   * @returns A Promise that resolves to an array of Commit objects representing the release notes.
   * @throws Error if failed to retrieve release notes.
   */
  async retrieveReleaseNotes(): Promise<Commit[]> {
    try {
      const response: ComparisonResponse =
        await this.api.repos.compareCommitsWithBasehead({
          owner: this.owner,
          repo: this.repo,
          basehead: `${this.base}...${this.head}`
        });

      const commits: Commit[] = response.data.commits.map(
        c => ({ message: c.commit.message }) as Commit
      );

      const releaseNotes = await this.generateReleaseLog(commits);

      return this.sanitizeCommitMessages(releaseNotes);
    } catch (error: Error | unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to retrieve release notes: ${error?.message}`);
      } else {
        throw new Error(`Failed to retrieve release notes: Unknown error`);
      }
    }
  }

  /**
   * Sanitizes commit messages by removing special characters.
   * @param commits An array of Commit objects.
   * @returns A new array of Commit objects with special characters removed from commit messages.
   */
  sanitizeCommitMessages(commits: Commit[]): Commit[] {
    const regex = new RegExp(/[^\w\s\-,.ÆØÅæøå#:()]/, "g");

    const processedArray = commits.map(commit => ({
      message: commit.message.replace(regex, "")
    }));

    return processedArray;
  }

  /**
   * Retrieves the first line of the commit message for a given reference.
   * @param ref The commit reference.
   * @returns A Promise that resolves to the commit message.
   * @throws Error if failed to retrieve commit message.
   */
  async retrieveCommitMessage(ref: string): Promise<string> {
    try {
      const response = await this.api.repos.getCommit({
        owner: this.owner,
        repo: this.repo,
        ref
      });

      return response.data.commit.message.split("\n")[0];
    } catch (error: Error | unknown) {
      if (error instanceof Error) {
        throw new Error(
          `Failed to retrieve commit message for ref ${ref}: ${error.message}`
        );
      } else {
        throw new Error(
          `Failed to retrieve commit message for ref ${ref}: Unknown error`
        );
      }
    }
  }

  /**
   * Extracts the first line from commit messages.
   * @param commits An array of Commit objects.
   * @returns A new array of Commit objects with only the first line of commit messages.
   */
  extractFirstLineFromCommits(commits: Commit[]): Commit[] {
    const releaseLogEntries: Commit[] = commits.map(
      commit =>
        ({
          message: this.extractFirstLineFromMessage(commit.message)
        }) as Commit
    );

    return releaseLogEntries;
  }

  /**
   * Retrieves the first line of a commit message.
   * @param message The commit message.
   * @returns The first line of the commit message.
   */
  extractFirstLineFromMessage(message: string | null | undefined): string {
    if (!message) {
      return "";
    }
    return message.split("\n")[0];
  }

  /**
   * Generates a release log from commits.
   * @param commits An array of Commit objects.
   * @returns A Promise that resolves to an array of Commit objects representing the release log.
   * @throws Error if failed to create release log.
   */
  async generateReleaseLog(commits: Commit[]): Promise<Commit[]> {
    const releaseLog: Commit[] = [];

    if (commits && commits.length !== 0) {
      releaseLog.push(...this.extractFirstLineFromCommits(commits));
    } else {
      try {
        const headReleaseLogEntry = await this.retrieveReleaseLogEntry(
          this.head
        );
        releaseLog.push(headReleaseLogEntry);
      } catch (error: Error | unknown) {
        if (error instanceof Error) {
          throw new Error(`Failed to create release log: ${error.message}`);
        } else {
          throw new Error("Failed to create release log: Unknown error");
        }
      }
    }

    return releaseLog.reverse();
  }

  /**
   * Retrieves the release log entry for a given reference.
   * @param ref The commit reference.
   * @returns A Promise that resolves to a Commit object representing the release log entry.
   * @throws Error if failed to retrieve release log entry.
   */
  async retrieveReleaseLogEntry(ref: string): Promise<Commit> {
    const commitMessage = await this.retrieveCommitMessage(ref);
    const releaseLogEntry = this.extractFirstLineFromMessage(commitMessage);

    return { message: releaseLogEntry };
  }
}
