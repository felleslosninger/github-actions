import * as github from "@actions/github";

export class DispatchEvent {
  static async send(
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
}
