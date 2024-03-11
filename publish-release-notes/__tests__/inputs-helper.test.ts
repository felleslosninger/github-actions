import * as core from "@actions/core";

import * as InputsHelpers from "../src/helpers";
import { Inputs } from "../src/interfaces";

jest.mock("@actions/core");

describe("loadInputs", () => {
  it("loads inputs correctly", () => {
    // act
    const {
      applicationName,
      dependabotReplacement,
      eventType,
      githubToken,
      ignoreApplications,
      ignoreCommits,
      ignoreProducts,
      product,
      releaseNotes,
      repositoryName,
      repositoryOwner,
      timestamp,
      title,
      version
    }: Inputs = InputsHelpers.loadInputs();

    // assert
    expect(applicationName).toBe("mocked-application-name");
    expect(dependabotReplacement).toBe("mocked-dependabot-replacement");
    expect(eventType).toBe("mocked-event-type");
    expect(githubToken).toBe("mocked-github-token");
    expect(ignoreApplications).toBe("mocked-ignore-applications");
    expect(ignoreCommits).toBe("mocked-ignore-commits");
    expect(product).toBe("mocked-product");
    expect(version).toBe("mocked-version");
    expect(releaseNotes).toEqual(
      expect.arrayContaining([
        "mocked-release-notes-1",
        "mocked-release-notes-2"
      ])
    );
    expect(timestamp).toBe("mocked-timestamp");
    expect(repositoryOwner).toBe("mocked-repository-owner");
    expect(repositoryName).toBe("mocked-repository-name");
    expect(ignoreProducts).toBe("mocked-ignore-products");
    expect(ignoreApplications).toBe("mocked-ignore-applications");
    expect(title).toBe("mocked-title");
  });

  it("loads default values", () => {
    // arrange
    jest.spyOn(core, "getInput").mockImplementation((name: string) => {
      if (name === "product") {
        return "mocked-product";
      } else if (name === "release-notes") {
        return '[""]';
      } else {
        return "";
      }
    });

    // act
    const {
      applicationName,
      dependabotReplacement,
      eventType,
      githubToken,
      ignoreApplications,
      ignoreCommits,
      ignoreProducts,
      product,
      releaseNotes,
      repositoryName,
      repositoryOwner,
      timestamp,
      title,
      version
    }: Inputs = InputsHelpers.loadInputs();

    // assert
    expect(applicationName).toBe("");
    expect(dependabotReplacement).toBe("");
    expect(eventType).toBe("");
    expect(githubToken).toBe("");
    expect(ignoreApplications).toBe("");
    expect(ignoreCommits).toBe("");
    expect(product).toBe("mocked-product");
    expect(version).toBe("");
    expect(releaseNotes).toEqual(expect.arrayContaining([""]));
    expect(timestamp).toBe("");
    expect(repositoryOwner).toBe("");
    expect(repositoryName).toBe("");
    expect(ignoreProducts).toBe("");
    expect(ignoreApplications).toBe("");
    expect(title).toBe("mocked-product");
  });
});
