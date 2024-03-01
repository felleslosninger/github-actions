export function getInput(name: string): string {
  switch (name) {
    case "application-name":
      return "mocked-application-name";
    case "product":
      return "mocked-product";
    case "version":
      return "mocked-version";
    case "release-notes":
      return "mocked-release-notes";
    case "timestamp":
      return "mocked-timestamp";
    case "github-token":
      return "mocked-github-token";
    case "repository-owner":
      return "mocked-repository-owner";
    case "repository-name":
      return "mocked-repository-name";
    case "sha":
      return "mocked-sha";
    case "public":
      return "true";
    case "public-ignore-products":
      return "mocked-public-ignore-products";
    case "public-ignore-applications":
      return "mocked-public-ignore-applications";
    case "public-title":
      return "mocked-public-title";
    default:
      return "";
  }
}

export const setFailed = jest.fn();

export const setOutput = jest.fn();
