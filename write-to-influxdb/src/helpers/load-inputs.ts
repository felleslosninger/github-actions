import * as core from "@actions/core";
import { WritePrecisionType } from "@influxdata/influxdb-client";
import { InputData } from "../interfaces/input-data";
import { toInputData } from "../converters/input-to-input-data";
import { toWritePrecisionType } from "../converters/input-to-write-precision-type";
import { Inputs } from "../interfaces/inputs";

export function loadInputs(): Inputs {
  const influxdbUrl: string = core.getInput("influxdb-url");
  const influxdbToken: string = core.getInput("influxdb-token");
  const organization: string = core.getInput("organization");
  const bucket: string = core.getInput("bucket");
  const inputData: InputData = toInputData(core.getInput("json"));
  const measurementName: string = core.getInput("measurement-name");
  const precision: WritePrecisionType = toWritePrecisionType(
    core.getInput("precision")
  );
  return {
    measurementName,
    inputData,
    influxdbUrl,
    influxdbToken,
    organization,
    bucket,
    precision
  };
}
