import * as core from "@actions/core";
import * as InputsHelpers from "./helpers/inputs-helper";
import { Inputs } from "./interfaces";
import { ReleaseNotesClient } from "./release-notes";

export async function run(): Promise<void> {
  try {
    const { repository, head, base, githubToken }: Inputs =
      InputsHelpers.loadInputs();

    const client = new ReleaseNotesClient(repository, base, head, githubToken);

    const releaseNotes: string[] = await client.getReleaseNotes();

    // Set the output indicating if release notes were created or not
    core.setOutput("release-notes", releaseNotes);
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message);
  }
}
