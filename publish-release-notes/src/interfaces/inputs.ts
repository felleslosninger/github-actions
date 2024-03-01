export interface Inputs {
  applicationName: string;
  product: string;
  version: string;
  releaseNotes: string;
  timestamp: string;
  githubToken: string;
  repositoryOwner: string;
  repositoryName: string;
  sha: string;
  isPublic: boolean;
  publicIgnoreProducts: string;
  publicIgnoreApplications: string;
  publicTitle: string;
}
