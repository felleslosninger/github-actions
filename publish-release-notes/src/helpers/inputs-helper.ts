import * as core from "@actions/core";
import { Inputs } from "../interfaces";

export function loadInputs(): Inputs {
  const applicationName = core.getInput("application-name", {
    required: true
  });
  const product = core.getInput("product", { required: true });
  const version = core.getInput("version", { required: true });
  const releaseNotes = core.getInput("release-notes", { required: true });
  const timestamp = core.getInput("timestamp", { required: true });
  const githubToken = core.getInput("github-token", { required: true });
  const repositoryOwner = core.getInput("repository-owner", {
    required: true
  });
  const repositoryName = core.getInput("repository-name", { required: true });
  const sha = core.getInput("sha") || "";
  const isPublic = core.getInput("public") === "true";
  const publicIgnoreProducts = core.getInput("public-ignore-products") || "";
  const publicIgnoreApplications =
    core.getInput("public-ignore-applications") || "";
  const publicTitle = core.getInput("public-title") || product;

  return {
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
  };
}
