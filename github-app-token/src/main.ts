import * as core from "@actions/core";
import { App } from "@octokit/app";

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const appId = core.getInput("app-id");
    const privateKey = core.getInput("private-key");
    const installationId = core.getInput("installation-id");
    const owner = core.getInput("owner") || process.env.GITHUB_REPOSITORY_OWNER;
    const repository =
      core.getInput("repository") || process.env.GITHUB_REPOSITORY;

    if (!owner) {
      throw new Error(
        "Owner was not supplied as an input or environment variable"
      );
    }

    if (!repository) {
      throw new Error(
        "Repository was not supplied as an input or environment variable"
      );
    }

    const app = new App({
      appId,
      privateKey
    });

    const {
      data: { token }
    } = await app.octokit.request(
      `POST /app/installations/${installationId}/access_tokens`,
      {
        repositories: [repository]
      }
    );

    core.setSecret(token);
    core.setOutput("token", token);
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message);
  }
}
