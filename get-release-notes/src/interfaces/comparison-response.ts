export interface ComparedCommit {
  sha: string;
  commit: { message: string };
}

export interface ComparisonResponse {
  data: {
    commits: ComparedCommit[];
  };
}
