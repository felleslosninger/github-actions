import * as core from "@actions/core";

import { InputsHelpers } from "../src/helpers";
import { Inputs } from "../src/interfaces";

jest.mock("@actions/core");

describe("loadInputs", () => {
  it("loads inputs correctly", () => {
    // act
    const {
      applicationName,
      product,
      version,
      releaseNotes,
      timestamp,
      githubToken,
      repositoryOwner,
      repositoryName,
      sha,
      isPublic,
      publicIgnoreProducts,
      publicIgnoreApplications,
      publicTitle
    }: Inputs = InputsHelpers.loadInputs();

    // assert
    expect(applicationName).toBe("mocked-application-name");
    expect(product).toBe("mocked-product");
    expect(version).toBe("mocked-version");
    expect(releaseNotes).toBe("mocked-release-notes");
    expect(timestamp).toBe("mocked-timestamp");
    expect(githubToken).toBe("mocked-github-token");
    expect(repositoryOwner).toBe("mocked-repository-owner");
    expect(repositoryName).toBe("mocked-repository-name");
    expect(sha).toBe("mocked-sha");
    expect(isPublic).toBe(true);
    expect(publicIgnoreProducts).toBe("mocked-public-ignore-products");
    expect(publicIgnoreApplications).toBe("mocked-public-ignore-applications");
    expect(publicTitle).toBe("mocked-public-title");
  });

  it("loads default values", () => {
    // arrange
    jest.spyOn(core, "getInput").mockImplementation((name: string) => {
      if (name === "product") {
        return "mocked-product";
      } else {
        return "";
      }
    });

    // act
    const {
      applicationName,
      product,
      version,
      releaseNotes,
      timestamp,
      githubToken,
      repositoryOwner,
      repositoryName,
      sha,
      isPublic,
      publicIgnoreProducts,
      publicIgnoreApplications,
      publicTitle
    }: Inputs = InputsHelpers.loadInputs();

    // assert
    expect(applicationName).toBe("");
    expect(product).toBe("mocked-product");
    expect(version).toBe("");
    expect(releaseNotes).toBe("");
    expect(timestamp).toBe("");
    expect(githubToken).toBe("");
    expect(repositoryOwner).toBe("");
    expect(repositoryName).toBe("");
    expect(sha).toBe("");
    expect(isPublic).toBe(false);
    expect(publicIgnoreProducts).toBe("");
    expect(publicIgnoreApplications).toBe("");
    expect(publicTitle).toBe("mocked-product");
  });
});
