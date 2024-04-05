import * as github from "@actions/github";
import * as core from "@actions/core";
import { RestEndpointMethodTypes } from "@octokit/action";

export async function getReleaseNotes(
  repository: string,
  headSha: string,
  baseSha: string,
  githubToken: string
): Promise<string[]> {
  const [owner, repo] = repository.split("/");

  const client = github.getOctokit(githubToken);

  const response: RestEndpointMethodTypes["repos"]["compareCommits"]["response"] =
    await client.rest.repos.compareCommits({
      owner,
      repo,
      base: baseSha,
      head: headSha
    });

  const commits = response.data.commits;

  core.info(`Commmits: ${commits}`);

  const releaseNotes = await createReleaseLog(commits);

  core.info(`Original Release Notes: ${JSON.stringify(releaseNotes)}`);

  const sanitizedReleaseNotes = removeSpecialCharacters(releaseNotes);

  core.info(
    `Sanitized Release Notes: ${JSON.stringify(sanitizedReleaseNotes)}`
  );

  return sanitizedReleaseNotes;
}

export function removeSpecialCharacters(input: string[]): string[] {
  // Regular expression to match all special characters except:
  // space, hyphen, comma, period, forward slash, Æ, Ø, Å, æ, ø, å, #, :, (, and )
  var regex = /[^\w\s\-,.\/ÆØÅæøå#:()]/g;

  // Loop through the array and remove special characters from each string
  const processedArray = input.map(inputString =>
    inputString.replace(regex, "")
  );

  return processedArray;
}

export async function getCommitMessage(ref) {
  return await github.rest.repos
    .getCommit({
      owner,
      repo,
      ref
    })
    .then(response => {
      return response.data.commit.message.split("\n")[0];
    });
}

function containsWordsToIgnore(releaseLogEntry) {
  for (let i = 0; i < ignoreList.length; i++) {
    if (releaseLogEntry.includes(ignoreList[i])) {
      return true;
    }
  }
  return false;
}

export function getReleaseLogEntries(commits) {
  let releaseLogEntries = [];

  commits.map(commit => {
    const releaseLogEntry = getFirstCommitLine(commit.commit.message);
    if (isValidReleaseLogEntry(releaseLogEntry)) {
      releaseLogEntries.push(releaseLogEntry);
    }
  });

  core.info(`Release log entries: ${releaseLogEntries}`);

  return releaseLogEntries;
}

async function getReleaseLogEntry(ref) {
  const commitMessage = await getCommitMessage(ref);
  const releaseLogEntry = getFirstCommitLine(commitMessage);

  core.info(`Release log entry: ${releaseLogEntry}`);

  return releaseLogEntry;
}

function isValidReleaseLogEntry(releaseLogEntry) {
  if (ignoreList.length !== 0) {
    if (containsWordsToIgnore(releaseLogEntry)) {
      return false;
    }
  }
  return true;
}

function getFirstCommitLine(message) {
  return message.split("\n")[0];
}

export async function createReleaseLog(commits) {
  let releaseLog = [];

  if (commits !== 0) {
    let releaseLogEntries = [];
    releaseLogEntries = getReleaseLogEntries(commits);
    releaseLog.push(...releaseLogEntries);
  } else {
    const headReleaseLogEntry = getReleaseLogEntry(head);

    if (isValidReleaseLogEntry(headReleaseLogEntry)) {
      releaseLog.push(headReleaseLogEntry);
    }
  }

  core.info(`Release log: ${releaseLog}`);

  return releaseLog.reverse();
}
