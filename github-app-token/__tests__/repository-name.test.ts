import { getRepositoryName } from "../src/repository-name";
import { describe, it, expect } from "@jest/globals";

describe("getRepositoryName", () => {
  it("returns fallback repository when repository is not provided", () => {
    const result = getRepositoryName("", "fallback-repo");
    expect(result).toBe("fallback-repo");
  });

  it("returns repository name when repository is provided without owner", () => {
    const result = getRepositoryName("repo-name", "fallback-repo");
    expect(result).toBe("repo-name");
  });

  it("returns repository name when repository is provided in <owner>/<name> format", () => {
    const result = getRepositoryName("owner/repo-name", "fallback-repo");
    expect(result).toBe("repo-name");
  });

  it("throws error for invalid repository format", () => {
    expect(() => {
      getRepositoryName("owner/repo1/repo2", "fallback-repo");
    }).toThrow(
      "Invalid repository name format. Use <owner>/<name> of <name> format."
    );
  });
});
