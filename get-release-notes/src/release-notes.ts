import * as github from "@actions/github";
import { Commit, ComparisonResponse } from "./interfaces";
import type { RestEndpointMethods } from "@octokit/plugin-rest-endpoint-methods/dist-types/generated/method-types";

export class ReleaseNotesClient {
  private api: RestEndpointMethods;
  private githubToken: string;
  private owner: string;
  private repo: string;
  private head: string;
  private base: string;

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

  async getReleaseNotes(): Promise<Commit[]> {
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

      const releaseNotes = await this.createReleaseLog(commits);

      return this.removeSpecialCharacters(releaseNotes);
    } catch (error: Error | unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to retrieve release notes: ${error?.message}`);
      } else {
        throw new Error(`Failed to retrieve release notes: Unknown error`);
      }
    }
  }

  removeSpecialCharacters(commits: Commit[]): Commit[] {
    const regex = new RegExp(/[^\w\s\-,.ÆØÅæøå#:()]/, "g");

    const processedArray = commits.map(commit => ({
      message: commit.message.replace(regex, "")
    }));

    return processedArray;
  }

  async getCommitMessage(ref: string): Promise<string> {
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

  trimCommitMessages(commits: Commit[]): Commit[] {
    const releaseLogEntries: Commit[] = commits.map(
      commit => ({ message: this.getFirstCommitLine(commit.message) }) as Commit
    );

    return releaseLogEntries;
  }

  async getReleaseLogEntry(ref: string): Promise<Commit> {
    try {
      const commitMessage = await this.getCommitMessage(ref);
      const releaseLogEntry = this.getFirstCommitLine(commitMessage);

      return { message: releaseLogEntry };
    } catch (error: Error | unknown) {
      if (error instanceof Error) {
        throw new Error(
          `Failed to retrieve release log entry for ref ${ref}: ${error.message}`
        );
      } else {
        throw new Error(
          `Failed to retrieve release log entry for ref ${ref}: Unknown error`
        );
      }
    }
  }

  getFirstCommitLine(message: string | null | undefined): string {
    if (!message) {
      return "";
    }
    return message.split("\n")[0];
  }

  async createReleaseLog(commits: Commit[]): Promise<Commit[]> {
    const releaseLog: Commit[] = [];

    if (commits && commits.length !== 0) {
      releaseLog.push(...this.trimCommitMessages(commits));
    } else {
      try {
        const headReleaseLogEntry = await this.getReleaseLogEntry(this.head);
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
}
