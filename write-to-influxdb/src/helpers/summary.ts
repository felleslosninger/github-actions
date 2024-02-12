import * as core from "@actions/core";
import { Point } from "@influxdata/influxdb-client";

export function write(point: Point): void {
  core.summary
    .addHeading("JSON Data", 3)
    .addCodeBlock(JSON.stringify(point, null, "\t"), "json")
    .write();
}
