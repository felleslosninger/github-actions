import * as core from "@actions/core";
import * as github from "@actions/github";
import { loadInputs } from "./helpers/inputs-helper";
import { publishReleaseNotes } from "./release-notes";

export async function run(): Promise<void> {
  try {
    const {
      applicationName,
      product,
      version,
      releaseNotes,
      timestamp,
      githubToken,
      repositoryOwner,
      repositoryName,
      sha,
      isPublic,
      publicIgnoreProducts,
      publicIgnoreApplications,
      publicTitle
    } = loadInputs();

    const releaseNotesArray: string[] = releaseNotes.split("\n");
    const client = github.getOctokit(githubToken);

    let releaseNotesCreated = false;

    if (
      isPublic &&
      !publicIgnoreProducts.includes(product) &&
      !publicIgnoreApplications.includes(applicationName)
    ) {
      releaseNotesCreated = await publishReleaseNotes(
        applicationName,
        timestamp,
        githubToken,
        product,
        releaseNotes,
        repositoryName,
        repositoryOwner,
        sha,
        publicTitle,
        version
      );
    }

    // Dispatch event to update changelog repository
    await client.rest.repos.createDispatchEvent({
      owner: repositoryOwner,
      repo: repositoryName,
      event_type: "update-changelog",
      client_payload: {
        "changelog-array": releaseNotesArray,
        "application-name": applicationName,
        product,
        version,
        timestamp,
        sha
      }
    });

    // Set the output indicating if release notes were created or not
    core.setOutput("release-notes-created", releaseNotesCreated.toString());
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message);
  }
}
