import { InputsHelpers } from "../src/helpers";

jest.mock("@actions/core");

describe("loadInputs", () => {
  it("loads inputs correctly", () => {
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
    } = InputsHelpers.loadInputs();

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
});
