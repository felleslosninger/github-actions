import * as core from "@actions/core";
import { InputsHelpers } from "./helpers/inputs-helper";
import { ReleaseNotes } from "./release-notes";
import { DistpatchEvent } from "./dispatch-event";
import { Inputs } from "./interfaces";

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
    }: Inputs = InputsHelpers.loadInputs();

    let releaseNotesCreated = false;

    if (releaseNotes && releaseNotes.trim().length !== 0) {
      const releaseNotesArray: string[] = releaseNotes.split("\n");

      if (
        isPublic &&
        !publicIgnoreProducts.includes(product) &&
        !publicIgnoreApplications.includes(applicationName)
      ) {
        releaseNotesCreated = await ReleaseNotes.publishReleaseNotes(
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

      const eventType = "update-changelog";

      const clientPayload = {
        "changelog-array": releaseNotesArray,
        "application-name": applicationName,
        product,
        version,
        timestamp,
        sha
      };

      await DistpatchEvent.send(
        githubToken,
        repositoryOwner,
        repositoryName,
        eventType,
        clientPayload
      );
    }

    // Set the output indicating if release notes were created or not
    core.setOutput("release-notes-created", releaseNotesCreated.toString());
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message);
  }
}
