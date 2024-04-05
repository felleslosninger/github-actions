import * as core from "@actions/core";
import { Inputs } from "../interfaces";

export function loadInputs(): Inputs {
  const repository: string = core.getInput("repository", { required: true });
  const headSha: string = core.getInput("head-sha", { required: true });
  const baseSha: string = core.getInput("base-sha", { required: true });
  const githubToken: string = core.getInput("github-token", { required: true });

  return {
    repository,
    headSha,
    baseSha,
    githubToken
  };
}
