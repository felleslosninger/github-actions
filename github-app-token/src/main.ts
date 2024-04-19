import * as core from "@actions/core";
import { App } from "@octokit/app";
import * as github from "@actions/github";
import { getRepositoryName } from "./repository-name";

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const appId = core.getInput("app-id");
    const privateKey = core.getInput("private-key");
    const installationId = core.getInput("installation-id");
    const repository = core.getInput("repository");

    const repositoryName: string = getRepositoryName(
      repository,
      github.context.repo.repo
    );

    core.info(`Repository: ${repositoryName}`);

    const app = new App({
      appId,
      privateKey
    });

    const {
      data: { token }
    } = await app.octokit.request(
      `POST /app/installations/${installationId}/access_tokens`,
      {
        repositories: [repositoryName]
      }
    );

    core.setSecret(token);
    core.setOutput("token", token);
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message);
  }
}
