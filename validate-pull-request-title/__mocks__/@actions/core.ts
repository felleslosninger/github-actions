export function getInput(name: string): string {
  switch (name) {
    case "pull-request-title":
      return "mocked-pull-request-title";
    case "max-length-title":
      return "100";
    case "min-length-title":
      return "10";
    case "allowed-prefixes":
      return "mocked-allowed-prefixes";
    default:
      return "";
  }
}

export function getBooleanInput(name: string): boolean {
  if (!name) {
    return false;
  }
  return true;
}

export const setFailed = jest.fn();

export const setOutput = jest.fn();

export const info = jest.fn();
