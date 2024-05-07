import * as core from "@actions/core";
import * as InputsHelpers from "./helpers/inputs-helper";
import { Commit, Inputs } from "./interfaces";
import ReleaseNotesClient from "./release-notes";
import { addPullRequestLinks, addJiraLinks } from "./helpers/links-helper";

export async function run(): Promise<void> {
  try {
    const {
      repository,
      head,
      base,
      githubToken,
      showPullRequestLinks,
      pullRequestBaseUrl,
      showJiraLinks,
      jiraBaseUrl
    }: Inputs = InputsHelpers.loadInputs();

    const client = new ReleaseNotesClient(repository, base, head, githubToken);

    const commits: Commit[] = await client.retrieveReleaseNotes();

    let releaseNotes = commits.map(c => c.message);

    if (showPullRequestLinks) {
      releaseNotes = addPullRequestLinks(pullRequestBaseUrl, releaseNotes);
    }

    if (showJiraLinks) {
      releaseNotes = addJiraLinks(jiraBaseUrl, releaseNotes);
    }

    core.setOutput("release-notes", releaseNotes);
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message);
  }
}
