export function getInput(name: string): string {
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
    case "ignore-products":
      return "mocked-ignore-products";
    case "product":
      return "mocked-product";
    case "version":
      return "mocked-version";
    case "release-notes":
      return '["mocked-release-notes-1", "mocked-release-notes-2"]';
    case "timestamp":
      return "mocked-timestamp";
    case "repository-owner":
      return "mocked-repository-owner";
    case "repository-name":
      return "mocked-repository-name";
    case "sha":
      return "mocked-sha";
    case "title":
      return "mocked-title";
    default:
      return "";
  }
}

export const setFailed = jest.fn();

export const setOutput = jest.fn();

export const info = jest.fn();
