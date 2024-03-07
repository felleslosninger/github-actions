import * as core from "@actions/core";
import * as InputsHelpers from "./helpers/inputs-helper";
import * as ReleaseNotes from "./release-notes";
import { Inputs } from "./interfaces";

export async function run(): Promise<void> {
  try {
    const {
      applicationName,
      dependabotReplacement,
      eventType,
      githubToken,
      ignoreApplications,
      ignoreCommits,
      ignoreProducts,
      product,
      releaseNotes,
      repositoryName,
      repositoryOwner,
      sha,
      timestamp,
      title,
      version
    }: Inputs = InputsHelpers.loadInputs();

    if (
      !releaseNotes ||
      !Array.isArray(releaseNotes) ||
      releaseNotes.length === 0 ||
      releaseNotes.every(item => item === "")
    ) {
      core.info("release-notes input was empty");
      core.setOutput("release-notes-created", "false");
      return;
    }

    if (
      ignoreProducts &&
      ignoreProducts.trim().length !== 0 &&
      ignoreProducts.includes(product)
    ) {
      core.info(`ignore-products includes the given product (${product})`);
      core.setOutput("release-notes-created", "false");
      return;
    }

    if (
      ignoreApplications &&
      ignoreApplications.trim().length !== 0 &&
      ignoreApplications.includes(applicationName)
    ) {
      core.info(
        `ignore-applications includes the given application (${applicationName})`
      );
      core.setOutput("release-notes-created", "false");
      return;
    }

    let success = false;

    success = await ReleaseNotes.publishReleaseNotes(
      applicationName,
      timestamp,
      githubToken,
      product,
      releaseNotes,
      repositoryName,
      repositoryOwner,
      sha,
      title,
      version,
      ignoreCommits,
      eventType,
      dependabotReplacement
    );

    // Set the output indicating if release notes were created or not
    core.setOutput("release-notes-created", success.toString());
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message);
  }
}
