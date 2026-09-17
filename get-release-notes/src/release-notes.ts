import * as github from "@actions/github";
import { Commit, ComparedCommit, ComparisonResponse } from "./interfaces";
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
  private applicationPath: string;

  /**
   * Constructs a new ReleaseNotesClient instance.
   * @param repository The GitHub repository in the format "owner/repo".
   * @param base The base branch or tag for comparison.
   * @param head The head branch or tag for comparison.
   * @param githubToken The GitHub authentication token.
   * @param applicationPath Optional path to the application in the repository.
   */
  constructor(
    repository: string,
    base: string,
    head: string,
    githubToken: string,
    applicationPath = ""
  ) {
    [this.owner, this.repo] = repository.split("/");
    this.githubToken = githubToken;
    this.base = base;
    this.head = head;
    this.applicationPath = applicationPath.trim().replace(/^\/|\/$/g, "");
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

      const commits = response.data.commits;
      const commitsForPath = this.applicationPath
        ? await this.filterCommitsByPath(commits)
        : commits;
      const releaseNotes: Commit[] = commitsForPath.map(
        c => ({ message: c.commit.message }) as Commit
      );

      const shouldFallBackToHead = !this.applicationPath;
      const generatedReleaseLog =
        commitsForPath.length > 0 || shouldFallBackToHead
          ? this.generateReleaseLog(releaseNotes)
          : Promise.resolve([]);

      return this.sanitizeCommitMessages(await generatedReleaseLog);
    } catch (error: Error | unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to retrieve release notes: ${error?.message}`);
      } else {
        throw new Error(`Failed to retrieve release notes: Unknown error`);
      }
    }
  }

  private async filterCommitsByPath(
    commits: ComparedCommit[]
  ): Promise<ComparedCommit[]> {
    const commitsWithFiles = await Promise.all(
      commits.map(async commit => {
        const response = await this.api.repos.getCommit({
          owner: this.owner,
          repo: this.repo,
          ref: commit.sha
        });

        const files = response.data.files ?? [];
        const changesApplication = files.some(file => {
          return [file.filename, file.previous_filename].some(filename => {
            if (!filename) {
              return false;
            }

            const normalizedFilename = filename.replace(/^\/|\/$/g, "");
            return (
              normalizedFilename === this.applicationPath ||
              normalizedFilename.startsWith(`${this.applicationPath}/`)
            );
          });
        });

        return changesApplication ? commit : undefined;
      })
    );

    return commitsWithFiles.filter(
      (commit): commit is ComparedCommit => commit !== undefined
    );
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
