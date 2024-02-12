import * as core from "@actions/core";
import { Point, WritePrecisionType } from "@influxdata/influxdb-client";
import { InputData } from "./interfaces/input-data.interface";

export function getPrecisionInput(): WritePrecisionType {
  const precision: string = core.getInput("precision");

  if (["ns", "us", "ms", "s"].includes(precision)) {
    return precision as WritePrecisionType;
  }

  throw new Error(`Unsupported precision type: ${precision}`);
}

export function getJsonInput(): InputData {
  const jsonAsString: string = core.getInput("json");

  const jsonObject = JSON.parse(jsonAsString);

  return jsonObject as InputData;
}

export function ConvertToPoint(
  measurementName: string,
  inputData: InputData
): Point {
  const point = new Point(measurementName);

  for (const [key, value] of Object.entries(inputData.tags)) {
    core.debug(`Tag key: ${key}, Tag value: ${value}`);
    point.tag(key, value);
  }

  for (const [key, value] of Object.entries(inputData.stringFields)) {
    core.debug(`StringField key: ${key}, StringField value: ${value}`);
    point.stringField(key, value);
  }
  return point;
}
