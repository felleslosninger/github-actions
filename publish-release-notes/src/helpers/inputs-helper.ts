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
  const sha = core.getInput("sha") || "";
  const allowProducts = core.getInput("allow-products") || "";
  const allowApplications = core.getInput("allow-applications") || "";
  const ignoreProducts = core.getInput("ignore-products") || "";
  const ignoreApplications = core.getInput("ignore-applications") || "";
  const dependabotReplacement = core.getInput("dependabot-replacement") || "";
  const ignoreCommits = core.getInput("ignore-commits") || "";
  const title = core.getInput("title") || product;

  if (
    allowProducts &&
    allowProducts.length > 0 &&
    ignoreProducts &&
    ignoreProducts.length > 0
  ) {
    throw new Error(
      "Setting both allow-products and ignore-products is not allowed"
    );
  }

  if (
    allowApplications &&
    allowApplications.length > 0 &&
    ignoreApplications &&
    ignoreApplications.length > 0
  ) {
    throw new Error(
      "Setting both allow-applications and ignore-applications is not allowed"
    );
  }

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
    sha,
    allowProducts,
    allowApplications,
    ignoreProducts,
    ignoreApplications,
    ignoreCommits,
    dependabotReplacement,
    title
  } as Inputs;
}
