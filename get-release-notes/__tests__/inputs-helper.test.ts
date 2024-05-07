import * as core from "@actions/core";
import * as InputsHelpers from "../src/helpers";
import { Inputs } from "../src/interfaces";
import { describe, it, jest, expect } from "@jest/globals";

jest.mock("@actions/core");

describe("loadInputs", () => {
  it("loads inputs correctly", () => {
    // act
    const {
      repository,
      head,
      base,
      githubToken,
      showPullRequestLinks,
      pullRequestBaseUrl,
      showJiraLinks,
      jiraBaseUrl
    }: Inputs = InputsHelpers.loadInputs();

    // assert
    expect(repository).toBe("mocked-repository");
    expect(head).toBe("mocked-head");
    expect(base).toBe("mocked-base");
    expect(githubToken).toBe("mocked-github-token");
    expect(showPullRequestLinks).toBe(true);
    expect(pullRequestBaseUrl).toBe("mocked-pull-request-base-url");
    expect(showJiraLinks).toBe(true);
    expect(jiraBaseUrl).toBe("mocked-jira-base-url");
  });

  it("loads default values", () => {
    // arrange
    jest.spyOn(core, "getInput").mockImplementation((name: string) => {
      if (name === "release-notes") {
        return '[""]';
      } else {
        return "";
      }
    });

    // act
    const {
      repository,
      head,
      base,
      githubToken,
      showPullRequestLinks,
      pullRequestBaseUrl,
      showJiraLinks,
      jiraBaseUrl
    }: Inputs = InputsHelpers.loadInputs();

    // assert
    expect(repository).toBe("");
    expect(head).toBe("");
    expect(base).toBe("");
    expect(githubToken).toBe("");
    expect(showPullRequestLinks).toBe(true);
    expect(pullRequestBaseUrl).toBe("");
    expect(showJiraLinks).toBe(true);
    expect(jiraBaseUrl).toBe("");
  });
});
