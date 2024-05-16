export interface Inputs {
  applicationName: string;
  product: string;
  version: string;
  releaseNotes: string[];
  timestamp: string;
  githubToken: string;
  repositoryOwner: string;
  repositoryName: string;
  eventType: string;
  sha: string;
  allowProducts: string;
  allowApplications: string;
  ignoreProducts: string;
  ignoreApplications: string;
  ignoreCommits: string;
  dependabotReplacement: string;
  title: string;
}
