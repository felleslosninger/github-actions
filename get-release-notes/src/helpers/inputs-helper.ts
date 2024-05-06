import * as core from "@actions/core";
import { Inputs } from "../interfaces";

export function loadInputs(): Inputs {
  const repository: string = core.getInput("repository", { required: true });
  const head: string = core.getInput("head", { required: true });
  const base: string = core.getInput("base", { required: true });
  const githubToken: string = core.getInput("github-token", { required: true });

  const showPullRequestLinks: boolean = core.getBooleanInput(
    "show-pull-request-links",
    { required: false }
  );

  let pullRequestBaseUrl = "";
  if (showPullRequestLinks) {
    pullRequestBaseUrl = core.getInput("pull-request-base-url", {
      required: true
    });
  }

  const showJiraLinks: boolean = core.getBooleanInput("show-jira-links", {
    required: false
  });

  let jiraBaseUrl = "";
  if (showJiraLinks) {
    jiraBaseUrl = core.getInput("jira-base-url", { required: true });
  }

  return {
    repository,
    head,
    base,
    githubToken,
    showPullRequestLinks,
    pullRequestBaseUrl,
    showJiraLinks,
    jiraBaseUrl
  };
}
