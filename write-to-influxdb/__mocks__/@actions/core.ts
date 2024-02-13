export function getInput(name: string): string {
  switch (name) {
    case "influxdb-url":
      return "mocked-influxdb-url";
    case "influxdb-token":
      return "mocked-influxdb-token";
    case "organization":
      return "mocked-organization";
    case "bucket":
      return "mocked-bucket";
    case "measurement-name":
      return "mocked-measurement-name";
    case "precision":
      return "ns";
    default:
      return "";
  }
}

export const summary = {
  addHeading: jest.fn().mockReturnThis(),
  addCodeBlock: jest.fn().mockReturnThis(),
  write: jest.fn().mockReturnThis()
};

export const setFailed = jest.fn();

export const setOutput = jest.fn();

export const debug = jest.fn();
