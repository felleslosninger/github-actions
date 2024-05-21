import * as core from "@actions/core";
import { describe, it, jest, expect } from "@jest/globals";

import * as InputsHelpers from "../src/helpers";
import { Inputs } from "../src/interfaces";

jest.mock("@actions/core");

describe("loadInputs", () => {
  it("loads inputs correctly", () => {
    // Mock core.getInput to return predefined values
    jest.spyOn(core, "getInput").mockImplementation((name: string) => {
      switch (name) {
        case "application-name":
          return "mocked-application-name";
        case "dependabot-replacement":
          return "mocked-dependabot-replacement";
        case "event-type":
          return "mocked-event-type";
        case "github-token":
          return "mocked-github-token";
        case "ignore-applications":
          return "mocked-ignore-applications";
        case "ignore-commits":
          return "mocked-ignore-commits";
        case "product":
          return "mocked-product";
        case "release-notes":
          return JSON.stringify([
            "mocked-release-notes-1",
            "mocked-release-notes-2"
          ]);
        case "timestamp":
          return "mocked-timestamp";
        case "repository-owner":
          return "mocked-repository-owner";
        case "repository-name":
          return "mocked-repository-name";
        case "sha":
          return "mocked-sha";
        case "ignore-products":
          return "mocked-ignore-products";
        case "title":
          return "mocked-title";
        default:
          return "";
      }
    });

    // act
    const {
      applicationName,
      dependabotReplacement,
      eventType,
      githubToken,
      allowApplications,
      allowProducts,
      ignoreApplications,
      ignoreCommits,
      ignoreProducts,
      product,
      releaseNotes,
      repositoryName,
      repositoryOwner,
      sha,
      timestamp,
      title,
      version
    }: Inputs = InputsHelpers.loadInputs();

    // assert
    expect(applicationName).toBe("mocked-application-name");
    expect(dependabotReplacement).toBe("mocked-dependabot-replacement");
    expect(eventType).toBe("mocked-event-type");
    expect(githubToken).toBe("mocked-github-token");
    expect(allowApplications).toBe("");
    expect(allowProducts).toBe("");
    expect(ignoreApplications).toBe("mocked-ignore-applications");
    expect(ignoreCommits).toBe("mocked-ignore-commits");
    expect(product).toBe("mocked-product");
    expect(version).toBe("");
    expect(releaseNotes).toEqual(
      expect.arrayContaining([
        "mocked-release-notes-1",
        "mocked-release-notes-2"
      ])
    );
    expect(timestamp).toBe("mocked-timestamp");
    expect(repositoryOwner).toBe("mocked-repository-owner");
    expect(repositoryName).toBe("mocked-repository-name");
    expect(sha).toBe("mocked-sha");
    expect(ignoreProducts).toBe("mocked-ignore-products");
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
      allowApplications,
      allowProducts,
      ignoreApplications,
      ignoreCommits,
      ignoreProducts,
      product,
      releaseNotes,
      repositoryName,
      repositoryOwner,
      sha,
      timestamp,
      title,
      version
    }: Inputs = InputsHelpers.loadInputs();

    // assert
    expect(applicationName).toBe("");
    expect(dependabotReplacement).toBe("");
    expect(eventType).toBe("");
    expect(githubToken).toBe("");
    expect(allowApplications).toBe("");
    expect(allowProducts).toBe("");
    expect(ignoreApplications).toBe("");
    expect(ignoreCommits).toBe("");
    expect(product).toBe("mocked-product");
    expect(version).toBe("");
    expect(releaseNotes).toEqual(expect.arrayContaining([""]));
    expect(timestamp).toBe("");
    expect(repositoryOwner).toBe("");
    expect(repositoryName).toBe("");
    expect(sha).toBe("");
    expect(ignoreProducts).toBe("");
    expect(ignoreApplications).toBe("");
    expect(title).toBe("mocked-product");
  });

  it("throws an error when both allow-products and ignore-products are set", () => {
    jest.spyOn(core, "getInput").mockImplementation((name: string) => {
      switch (name) {
        case "release-notes":
          return JSON.stringify([
            "mocked-release-notes-1",
            "mocked-release-notes-2"
          ]);
        case "allow-products":
          return "product1,product2";
        case "ignore-products":
          return "product3,product4";
        default:
          return "";
      }
    });

    expect(() => {
      InputsHelpers.loadInputs();
    }).toThrow(
      "Setting both allow-products and ignore-products is not allowed"
    );
  });

  it("throws an error when both allow-applications and ignore-applications are set", () => {
    jest.spyOn(core, "getInput").mockImplementation((name: string) => {
      switch (name) {
        case "release-notes":
          return JSON.stringify([
            "mocked-release-notes-1",
            "mocked-release-notes-2"
          ]);
        case "allow-applications":
          return "app1,app2";
        case "ignore-applications":
          return "app3,app4";
        default:
          return "";
      }
    });

    expect(() => {
      InputsHelpers.loadInputs();
    }).toThrow(
      "Setting both allow-applications and ignore-applications is not allowed"
    );
  });
});
