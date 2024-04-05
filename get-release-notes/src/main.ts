import * as core from "@actions/core";
import * as InputsHelpers from "./helpers/inputs-helper";
import * as ReleaseNotes from "./release-notes";
import { Inputs } from "./interfaces";

export async function run(): Promise<void> {
  try {
    const { repository, headSha, baseSha, githubToken }: Inputs =
      InputsHelpers.loadInputs();

    const releaseNotes: string[] = ReleaseNotes.getReleaseNotes(
      repository,
      headSha,
      baseSha,
      githubToken
    );

    // Set the output indicating if release notes were created or not
    core.setOutput("release-notes", releaseNotes);
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message);
  }
}
