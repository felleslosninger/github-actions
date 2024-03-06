import * as DispatchEvent from "../src/dispatch-event";
import * as github from "@actions/github";

describe("DispatchEvent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should send dispatch event successfully", async () => {
    // arrange
    const githubToken = "test_token";
    const repositoryOwner = "test_owner";
    const repositoryName = "test_repo";
    const eventType = "update-release-notes";
    const clientPayload = {};

    /* eslint-disable @typescript-eslint/no-explicit-any */
    jest.spyOn(github, "getOctokit").mockReturnValue({
      rest: {
        repos: {
          createDispatchEvent: jest.fn().mockResolvedValue(true)
        }
      }
    } as any);
    /* eslint-enable @typescript-eslint/no-explicit-any */

    // act
    await DispatchEvent.sendDispatchEvent(
      githubToken,
      repositoryOwner,
      repositoryName,
      eventType,
      clientPayload
    );

    // assert
    expect(github.getOctokit).toHaveBeenCalledWith(githubToken);
    expect(
      github.getOctokit(githubToken).rest.repos.createDispatchEvent
    ).toHaveBeenCalledWith({
      owner: repositoryOwner,
      repo: repositoryName,
      event_type: eventType,
      client_payload: clientPayload
    });
  });

  it("should handle errors during dispatch event", async () => {
    // arrange
    const githubToken = "test_token";
    const repositoryOwner = "test_owner";
    const repositoryName = "test_repo";
    const eventType = "update-release-notes";
    const clientPayload = {};

    const errorMessage = "Error sending dispatch event";

    /* eslint-disable @typescript-eslint/no-explicit-any */
    jest.spyOn(github, "getOctokit").mockReturnValue({
      rest: {
        repos: {
          createDispatchEvent: jest
            .fn()
            .mockRejectedValue(new Error(errorMessage))
        }
      }
    } as any);
    /* eslint-enable @typescript-eslint/no-explicit-any */

    // act & assert
    await expect(
      DispatchEvent.sendDispatchEvent(
        githubToken,
        repositoryOwner,
        repositoryName,
        eventType,
        clientPayload
      )
    ).rejects.toThrow(errorMessage);
  });
});
