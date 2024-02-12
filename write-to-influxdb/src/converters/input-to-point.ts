import { Point } from "@influxdata/influxdb-client";
import { InputData } from "../interfaces/input-data";

export function toPoint(measurementName: string, inputData: InputData): Point {
  const point = new Point(measurementName);

  for (const [key, value] of Object.entries(inputData.tags)) {
    point.tag(key, value);
  }

  for (const [key, value] of Object.entries(inputData.stringFields)) {
    point.stringField(key, value);
  }
  return point;
}
