export function getInput(name: string): string {
  switch (name) {
    case "repository":
      return "mocked-repository";
    case "base":
      return "mocked-base";
    case "head":
      return "mocked-head";
    case "github-token":
      return "mocked-github-token";
    case "pull-request-base-url":
      return "mocked-pull-request-base-url";
    case "jira-base-url":
      return "mocked-jira-base-url";
    default:
      return "";
  }
}

export function getBooleanInput(name: string): boolean {
  switch (name) {
    case "show-pull-request-links":
    case "show-jira-links":
      return true;
    default:
      return false;
  }
}

export const setFailed = jest.fn();

export const setOutput = jest.fn();

export const info = jest.fn();
