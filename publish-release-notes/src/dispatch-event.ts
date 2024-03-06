import * as github from "@actions/github";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function sendDispatchEvent(
  githubToken: string,
  repositoryOwner: string,
  repositoryName: string,
  eventType: string,
  clientPayload: any
): Promise<void> {
  const client = github.getOctokit(githubToken);

  await client.rest.repos.createDispatchEvent({
    owner: repositoryOwner,
    repo: repositoryName,
    event_type: eventType,
    client_payload: clientPayload
  });
}
/* eslint-enable @typescript-eslint/no-explicit-any */
