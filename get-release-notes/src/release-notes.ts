import * as github from "@actions/github";
import * as core from "@actions/core";
import { RestEndpointMethodTypes } from "@octokit/action";
import type { RestEndpointMethods } from "@octokit/plugin-rest-endpoint-methods/dist-types/generated/method-types";

export class ReleaseNotesClient {
  api: RestEndpointMethods;
  githubToken: string;
  owner: string;
  repo: string;
  head: string;
  base: string;

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
    core.debug("ctor()");
    core.debug(`owner: ${this.owner}`);
    core.debug(`repo: ${this.repo}`);
  }

  async getReleaseNotes(): Promise<string[]> {
    const response: RestEndpointMethodTypes["repos"]["compareCommits"]["response"] =
      await this.api.repos.compareCommitsWithBasehead({
        owner: this.owner,
        repo: this.repo,
        basehead: `${this.base}...${this.head}`
      });

    core.debug(`Response: ${response}`);

    const commits = response.data.commits;

    core.info(`Commmits: ${commits}`);

    const releaseNotes = await this.createReleaseLog(commits);

    core.info(`Original Release Notes: ${JSON.stringify(releaseNotes)}`);

    const sanitizedReleaseNotes = this.removeSpecialCharacters(releaseNotes);

    core.info(
      `Sanitized Release Notes: ${JSON.stringify(sanitizedReleaseNotes)}`
    );

    return sanitizedReleaseNotes;
  }

  removeSpecialCharacters(input: string[]): string[] {
    // Regular expression to match all special characters except:
    // space, hyphen, comma, period, forward slash, Æ, Ø, Å, æ, ø, å, #, :, (, and )
    const regex = /[^\w\s\-,.\/ÆØÅæøå#:()]/g;

    // Loop through the array and remove special characters from each string
    const processedArray = input.map(inputString =>
      inputString.replace(regex, "")
    );

    return processedArray;
  }

  async getCommitMessage(ref: string): Promise<string> {
    const response = await this.api.repos.getCommit({
      owner: this.owner,
      repo: this.repo,
      ref
    });

    return response.data.commit.message.split("\n")[0];
  }

  getReleaseLogEntries(commits: any) {
    const releaseLogEntries: any[] = [];

    // commits.map(commit => {
    //   const releaseLogEntry = this.getFirstCommitLine(commit.commit.message);

    //   releaseLogEntries.push(releaseLogEntry);
    // });

    // core.info(`Release log entries: ${releaseLogEntries}`);

    return releaseLogEntries;
  }

  async getReleaseLogEntry(ref: string) {
    const commitMessage = await this.getCommitMessage(ref);
    const releaseLogEntry = this.getFirstCommitLine(commitMessage);

    core.info(`Release log entry: ${releaseLogEntry}`);

    return releaseLogEntry;
  }

  getFirstCommitLine(message: string): string {
    return message.split("\n")[0];
  }

  async createReleaseLog(commits: any): Promise<any> {
    const releaseLog = [];

    if (commits !== 0) {
      let releaseLogEntries = [];
      releaseLogEntries = this.getReleaseLogEntries(commits);
      releaseLog.push(...releaseLogEntries);
    } else {
      const headReleaseLogEntry = this.getReleaseLogEntry(this.head);
      releaseLog.push(headReleaseLogEntry);
    }

    core.info(`Release log: ${releaseLog}`);

    return releaseLog.reverse();
  }
}
