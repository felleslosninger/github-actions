import * as core from "@actions/core";
import { InfluxDB } from "@influxdata/influxdb-client";
import { run } from "../src/main";
import { toPoint } from "../src/converters";
import { loadInputs } from "../src/helpers";
import { writeToSummary } from "../src/helpers";

jest.mock("@actions/core");
jest.mock("@influxdata/influxdb-client");
jest.mock("../src/converters/input-to-point");
jest.mock("../src/helpers/inputs");
jest.mock("../src/helpers/summary");

describe("run", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("writes point to InfluxDB and summary", async () => {
    // Mock loadInputs function to return sample inputs
    const sampleInputs = {
      measurementName: "testMeasurement",
      inputData: { tags: {}, stringFields: {} },
      influxdbUrl: "http://example.com",
      influxdbToken: "token",
      organization: "org",
      bucket: "bucket",
      precision: "s"
    };
    (loadInputs as jest.Mock).mockReturnValue(sampleInputs);

    // Mock convertToPoint function to return sample point
    const samplePoint = {
      measurement: "testMeasurement",
      fields: {},
      tags: {}
    };
    (toPoint as jest.Mock).mockReturnValue(samplePoint);

    // Mock InfluxDB client methods
    const writePointMock = jest.fn();
    const closeMock = jest.fn();
    const getWriteApiMock = jest
      .fn()
      .mockReturnValue({ writePoint: writePointMock, close: closeMock });
    (InfluxDB as jest.Mock).mockImplementation(() => ({
      getWriteApi: getWriteApiMock
    }));

    // Run the function
    await run();

    // Verify that loadInputs is called
    expect(loadInputs).toHaveBeenCalled();

    // Verify that convertToPoint is called with sample inputs
    expect(toPoint).toHaveBeenCalledWith(
      sampleInputs.measurementName,
      sampleInputs.inputData
    );

    // Verify that InfluxDB client is created with correct parameters
    expect(InfluxDB).toHaveBeenCalledWith({
      url: sampleInputs.influxdbUrl,
      token: sampleInputs.influxdbToken
    });
    expect(getWriteApiMock).toHaveBeenCalledWith(
      sampleInputs.organization,
      sampleInputs.bucket,
      sampleInputs.precision
    );

    // Verify that writePoint and close are called on InfluxDB client
    expect(writePointMock).toHaveBeenCalledWith(samplePoint);
    expect(closeMock).toHaveBeenCalled();

    // Verify that writeSummary is called with sample point
    expect(writeToSummary).toHaveBeenCalledWith(samplePoint);

    // Verify that core.setFailed is not called
    expect(core.setFailed).not.toHaveBeenCalled();
    expect(core.setOutput).toHaveBeenCalledWith("success", "true");
  });

  it("fails when an error occurs", async () => {
    // Mock loadInputs function to throw an error
    const error = new Error("Error occurred");
    (loadInputs as jest.Mock).mockImplementation(() => {
      throw error;
    });

    // Run the function
    await run();

    // Verify that core.setFailed is called with the error message
    expect(core.setFailed).toHaveBeenCalledWith(error.message);
  });
});
