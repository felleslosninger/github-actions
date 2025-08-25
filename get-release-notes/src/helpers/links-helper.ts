export function addPullRequestLinks(
  baseUrl: string,
  releaseNotes: string[]
): string[] {
  // Regular expression to match pull-request numbers
  const prRegex = /#\d+/g;

  // Iterate over each release note
  return releaseNotes.map(note => {
    // Replace pull-request numbers with links
    return note.replace(prRegex, prNumber => {
      return `[${prNumber}](${baseUrl}/${prNumber.slice(1)})`;
    });
  });
}

export function addJiraLinks(
  baseUrl: string,
  releaseNotes: string[]
): string[] {
  // Regular expression to match the pattern <alpha>[<alpha><alpha>]<alpha>-<number><number><number>
  const jiraRegex = /\b[A-Za-z]{2,4}-\d{1,4}\b/g;

  // Iterate over each release note
  return releaseNotes.map(note => {
    // Replace Jira IDs with links
    return note.replace(jiraRegex, jiraId => {
      return `[${jiraId}](${baseUrl}/${jiraId})`;
    });
  });
}
