export interface Inputs {
  repository: string;
  head: string;
  base: string;
  applicationPath: string;
  githubToken: string;
  showPullRequestLinks: boolean;
  pullRequestBaseUrl: string;
  showJiraLinks: boolean;
  jiraBaseUrl: string;
}
