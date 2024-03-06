import * as github from "@actions/github";

export function filterReleaseNotes(
  releaseNotes: string,
  ignoreCommits: string,
  dependabotReplacement: string
): string {
  if (!releaseNotes || releaseNotes.trim().length === 0) {
    return "";
  }

  const ignorePatterns: string[] = ignoreCommits.split(",");
  let releaseNotesArray = releaseNotes.split("\n");
  let bumpReplaced = false; // Flag to track if "Bump" has been replaced

  if (ignoreCommits && ignoreCommits.length !== 0) {
    releaseNotesArray = releaseNotesArray.filter(item => {
      // Removes all commits that match the provided `ignoreCommits` list
      return !ignorePatterns?.some(pattern => item.includes(pattern));
    });
  }

  if (dependabotReplacement && dependabotReplacement.length !== 0) {
    releaseNotesArray = releaseNotesArray
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

  const result = releaseNotesArray
    .map(item => {
      return `- ${item}`;
    })
    .join("\n")
    .trim();

  return result;
}

export async function publishReleaseNotes(
  applicationName: string,
  date: string,
  githubToken: string,
  product: string,
  releaseNotes: string,
  repositoryName: string,
  repositoryOwner: string,
  sha: string,
  title: string,
  version: string,
  ignoreCommits: string,
  eventType: string,
  dependabotReplacement: string
): Promise<boolean> {
  const filteredReleaseNotes: string = filterReleaseNotes(
    releaseNotes,
    ignoreCommits,
    dependabotReplacement
  );

  if (!filteredReleaseNotes || filteredReleaseNotes.trim().length === 0) {
    return false;
  }

  const client = github.getOctokit(githubToken);

  const dispatchPayload = {
    "release-notes": filteredReleaseNotes,
    "application-name": applicationName,
    product,
    version,
    date,
    sha,
    title
  };

  // Dispatch event to update release notes repository
  await client.rest.repos.createDispatchEvent({
    owner: repositoryOwner,
    repo: repositoryName,
    event_type: eventType,
    client_payload: dispatchPayload
  });

  return true;
}
