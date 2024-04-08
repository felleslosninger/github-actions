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
    default:
      return "";
  }
}

export const setFailed = jest.fn();

export const setOutput = jest.fn();

export const info = jest.fn();
