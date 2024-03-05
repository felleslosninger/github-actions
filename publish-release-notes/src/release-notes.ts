import * as github from "@actions/github";

export class ReleaseNotes {
  static filterReleaseNotes(releaseNotes: string): string {
    if (!releaseNotes || releaseNotes.trim().length === 0) {
      return "";
    }

    const ignorePatterns = ["(INTERNAL-COMMIT)"];
    const replacements = new Map([["Bump", "Library upgrades"]]);
    const searchesFound = new Set();
    const releaseNotesArray = releaseNotes.split("\n");

    const filteredReleaseNotes: string = releaseNotesArray
      .map(item => {
        if (ignorePatterns.some(pattern => item.includes(pattern))) {
          return null;
        }
        let issue: string | undefined = `- ${item}`;
        for (const [search, replacement] of replacements) {
          if (item.startsWith(search)) {
            if (!searchesFound.has(search)) {
              issue = `- ${replacement}`;
              searchesFound.add(search);
            } else {
              issue = undefined;
            }
            break;
          }
        }
        return issue;
      })
      .filter(issue => issue !== undefined)
      .join("\n")
      .trim();

    return filteredReleaseNotes;
  }

  static async publishReleaseNotes(
    applicationName: string,
    date: string,
    githubToken: string,
    product: string,
    releaseNotes: string,
    repositoryName: string,
    repositoryOwner: string,
    sha: string,
    title: string,
    version: string
  ): Promise<boolean> {
    const filteredReleaseNotes: string =
      ReleaseNotes.filterReleaseNotes(releaseNotes);

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
      event_type: "update-release-notes",
      client_payload: dispatchPayload
    });

    return true;
  }
}
