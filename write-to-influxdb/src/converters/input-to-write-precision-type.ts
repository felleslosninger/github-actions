import { WritePrecisionType } from "@influxdata/influxdb-client";

export function toWritePrecisionType(precision: string): WritePrecisionType {
  if (["ns", "us", "ms", "s"].includes(precision)) {
    return precision as WritePrecisionType;
  }

  throw new Error(`Unsupported precision type: ${precision}`);
}
