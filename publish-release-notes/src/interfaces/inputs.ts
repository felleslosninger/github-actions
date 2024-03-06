export interface Inputs {
  applicationName: string;
  product: string;
  version: string;
  releaseNotes: string;
  timestamp: string;
  githubToken: string;
  repositoryOwner: string;
  repositoryName: string;
  eventType: string;
  sha: string;
  ignoreProducts: string;
  ignoreApplications: string;
  dependabotReplacement: string;
  ignoreCommits: string;
  title: string;
}
