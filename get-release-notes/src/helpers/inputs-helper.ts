import * as core from "@actions/core";
import { Inputs } from "../interfaces";

export function loadInputs(): Inputs {
  const repository: string = core.getInput("repository", { required: true });
  const head: string = core.getInput("head", { required: true });
  const base: string = core.getInput("base", { required: true });
  const githubToken: string = core.getInput("github-token", { required: true });

  return {
    repository,
    head,
    base,
    githubToken
  };
}
