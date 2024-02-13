import * as core from "@actions/core";
import { InfluxDB } from "@influxdata/influxdb-client";
import { Inputs } from "./interfaces";
import { loadInputs, writeToSummary } from "./helpers";
import { toPoint } from "./converters";

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const {
      measurementName,
      inputData,
      influxdbUrl,
      influxdbToken,
      organization,
      bucket,
      precision
    }: Inputs = loadInputs();

    const point = toPoint(measurementName, inputData);

    const client = new InfluxDB({
      url: influxdbUrl,
      token: influxdbToken
    }).getWriteApi(organization, bucket, precision);

    client.writePoint(point);

    writeToSummary(point);

    // Flush pending writes and close client.
    await client.close();
    core.setOutput("success", "true");
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message);
  }
}
