import * as core from "@actions/core";
import { Inputs } from "../interfaces";

export function loadInputs(): Inputs {
  const applicationName = core.getInput("application-name", {
    required: true
  });
  const product = core.getInput("product", { required: true });
  const version = core.getInput("version", { required: true });
  const releaseNotes: string[] = JSON.parse(
    core.getInput("release-notes", {
      required: true
    })
  );
  const timestamp = core.getInput("timestamp", { required: true });
  const githubToken = core.getInput("github-token", { required: true });
  const repositoryOwner = core.getInput("repository-owner", {
    required: true
  });
  const repositoryName = core.getInput("repository-name", { required: true });
  const eventType = core.getInput("event-type", { required: true });
  const ignoreProducts = core.getInput("ignore-products") || "";
  const ignoreApplications = core.getInput("ignore-applications") || "";
  const dependabotReplacement = core.getInput("dependabot-replacement") || "";
  const ignoreCommits = core.getInput("ignore-commits") || "";
  const title = core.getInput("title") || product;

  return {
    applicationName,
    product,
    version,
    releaseNotes,
    timestamp,
    githubToken,
    repositoryOwner,
    repositoryName,
    eventType,
    ignoreProducts,
    ignoreApplications,
    dependabotReplacement,
    ignoreCommits,
    title
  } as Inputs;
}
