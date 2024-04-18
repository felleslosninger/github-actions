export interface ComparisonResponse {
  data: {
    commits: { commit: { message: string } }[];
  };
}
