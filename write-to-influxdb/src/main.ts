import * as core from "@actions/core";
import { InputData } from "./interfaces/input-data.interface";
import { InfluxDB, WritePrecisionType } from "@influxdata/influxdb-client";
import { ConvertToPoint, getJsonInput, getPrecisionInput } from "./helpers";

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const influxdbUrl: string = core.getInput("influxdb-url");
    const influxdbToken: string = core.getInput("influxdb-token");
    const organization: string = core.getInput("organization");
    const bucket: string = core.getInput("bucket");
    const inputData: InputData = getJsonInput();
    const measurementName: string = core.getInput("measurement-name");
    const precision: WritePrecisionType = getPrecisionInput();

    const point = ConvertToPoint(measurementName, inputData);

    const client = new InfluxDB({
      url: influxdbUrl,
      token: influxdbToken,
    }).getWriteApi(organization, bucket, precision);

    client.writePoint(point);

    core.summary
      .addHeading("JSON Data", 3)
      .addCodeBlock(JSON.stringify(point, null, "\t"), "json")
      .write();

    // Flush pending writes and close client.
    await client.close();
    core.debug("Write finished");
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message);
  }
}
