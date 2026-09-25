import * as github from "@actions/github";
import * as core from "@actions/core";

export function filterReleaseNotes(
  releaseNotes: string[],
  ignoreCommits: string,
  dependabotReplacement: string,
  allowCommits: string
): string[] {
  if (!releaseNotes || releaseNotes.length === 0) {
    return [];
  }

  let bumpReplaced = false; // Flag to track if "Bump" has been replaced

  if (allowCommits && allowCommits.length !== 0) {
    const allowPatterns: string[] = allowCommits.split(",");
    releaseNotes = releaseNotes.filter(item =>
      allowPatterns.some(pattern => item.includes(pattern))
    );
  }

  const ignorePatterns: string[] = ignoreCommits.split(",");

  if (ignoreCommits && ignoreCommits.length !== 0) {
    releaseNotes = releaseNotes.filter(item => {
      // Removes all commits that match the provided `ignoreCommits` list
      return !ignorePatterns?.some(pattern => item.includes(pattern));
    });
  }

  if (dependabotReplacement && dependabotReplacement.length !== 0) {
    releaseNotes = releaseNotes
      .map(item => {
        // Check if the item starts with "Bump" and if it's not already replaced
        if (item.trim().startsWith("Bump")) {
          if (bumpReplaced) {
            return undefined;
          }
          bumpReplaced = true; // Set flag to true since we've replaced "Bump"
          return `${dependabotReplacement}`;
        }
        return `${item.trim()}`;
      })
      .filter(issue => issue !== undefined) as string[];
  }

  return releaseNotes;
}

export async function publishReleaseNotes(
  applicationName: string,
  date: string,
  githubToken: string,
  product: string,
  releaseNotes: string[],
  repositoryName: string,
  repositoryOwner: string,
  sha: string,
  title: string,
  version: string,
  ignoreCommits: string,
  eventType: string,
  dependabotReplacement: string,
  environment: string,
  allowCommits: string
): Promise<boolean> {
  const filteredReleaseNotes: string[] = filterReleaseNotes(
    releaseNotes,
    ignoreCommits,
    dependabotReplacement,
    allowCommits
  );

  if (
    !filteredReleaseNotes ||
    !Array.isArray(filteredReleaseNotes) ||
    filteredReleaseNotes.length === 0 ||
    filteredReleaseNotes.every(item => item === "")
  ) {
    return false;
  }

  const client = github.getOctokit(githubToken);

  const clientPayload = {
    "release-notes": JSON.stringify(filteredReleaseNotes),
    "application-name": applicationName,
    product,
    version,
    date,
    sha,
    title,
    environment
  };

  core.info(`client_payload: ${JSON.stringify(clientPayload)}`);

  // Dispatch event to update release notes repository
  await client.rest.repos.createDispatchEvent({
    owner: repositoryOwner,
    repo: repositoryName,
    event_type: eventType,
    client_payload: clientPayload
  });

  return true;
}
