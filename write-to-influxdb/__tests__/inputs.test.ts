import { loadInputs } from "../src/helpers/inputs";

jest.mock("@actions/core");
jest.mock("@influxdata/influxdb-client");
jest.mock("../src/converters/input-to-input-data");

describe("loadInputs", () => {
  it("loads inputs correctly", () => {
    const inputs = loadInputs();

    expect(inputs.influxdbUrl).toBe("mocked-influxdb-url");
    expect(inputs.influxdbToken).toBe("mocked-influxdb-token");
    expect(inputs.organization).toBe("mocked-organization");
    expect(inputs.bucket).toBe("mocked-bucket");
  });
});
