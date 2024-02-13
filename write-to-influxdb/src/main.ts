import * as core from "@actions/core";
import { InfluxDB } from "@influxdata/influxdb-client";
import { toPoint } from "./converters/input-to-point";
import { loadInputs } from "./helpers/load-inputs";
import * as summary from "./helpers/summary";
import { Inputs } from "./interfaces/inputs";

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

    summary.write(point);

    // Flush pending writes and close client.
    await client.close();
    core.setOutput("success", "true");
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message);
  }
}
