import * as github from "@actions/github";
import * as core from "@actions/core";
import { Commit } from "./interfaces";
import { RestEndpointMethodTypes } from "@octokit/action";
import type { RestEndpointMethods } from "@octokit/plugin-rest-endpoint-methods/dist-types/generated/method-types";
import { runInThisContext } from "vm";

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

  async getReleaseNotes(): Promise<Commit[]> {
    const response: RestEndpointMethodTypes["repos"]["compareCommits"]["response"] =
      await this.api.repos.compareCommitsWithBasehead({
        owner: this.owner,
        repo: this.repo,
        basehead: `${this.base}...${this.head}`
      });

    core.debug(`Response: ${JSON.stringify(response)}`);

    const commits: Commit[] = response.data.commits.map(
      c => <Commit>{ message: c.commit.message }
    );

    core.debug(`Commmits: ${commits}`);

    const releaseNotes = await this.createReleaseLog(commits);

    core.info(`Original Release Notes: ${JSON.stringify(releaseNotes)}`);

    const sanitizedReleaseNotes = this.removeSpecialCharacters(releaseNotes);

    core.info(
      `Sanitized Release Notes: ${JSON.stringify(sanitizedReleaseNotes)}`
    );

    return sanitizedReleaseNotes;
  }

  removeSpecialCharacters(commits: Commit[]): Commit[] {
    // Regular expression to match all special characters except:
    // space, hyphen, comma, period, forward slash, Æ, Ø, Å, æ, ø, å, #, :, (, and )
    const regex = /[^\w\s\-,.\/ÆØÅæøå#:()]/g;

    // Loop through the array and remove special characters from each string
    const processedArray = commits.map(
      commit =>
        <Commit>{
          message: commit.message.replace(regex, "")
        }
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

  trimCommitMessages(commits: Commit[]): Commit[] {
    const releaseLogEntries: Commit[] = commits.map(
      commit =>
        <Commit>{
          message: this.getFirstCommitLine(commit.message)
        }
    );

    core.debug(`Release log entries: ${releaseLogEntries}`);

    return releaseLogEntries;
  }

  async getReleaseLogEntry(ref: string): Promise<Commit> {
    const commitMessage = await this.getCommitMessage(ref);
    const releaseLogEntry = this.getFirstCommitLine(commitMessage);

    core.info(`Release log entry: ${releaseLogEntry}`);

    return { message: releaseLogEntry };
  }

  getFirstCommitLine(message: string): string {
    return message.split("\n")[0];
  }

  async createReleaseLog(commits: Commit[]): Promise<Commit[]> {
    const releaseLog: Commit[] = [];

    if (commits && commits.length !== 0) {
      releaseLog.push(...this.trimCommitMessages(commits));
    } else {
      const headReleaseLogEntry = await this.getReleaseLogEntry(this.head);
      releaseLog.push(headReleaseLogEntry);
    }

    core.debug(`Release log: ${releaseLog}`);

    return releaseLog.reverse();
  }
}
