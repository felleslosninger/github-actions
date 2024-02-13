import * as core from "@actions/core";
import { Point } from "@influxdata/influxdb-client";

export function writeToSummary(point: Point): void {
  core.summary
    .addHeading("JSON Data", 3)
    .addCodeBlock(JSON.stringify(point, null, "\t"), "json")
    .write();
}
