import { WritePrecisionType } from "@influxdata/influxdb-client";
import { InputData } from "./input-data";

export interface Inputs {
  measurementName: string;
  inputData: InputData;
  influxdbUrl: string;
  influxdbToken: string;
  organization: string;
  bucket: string;
  precision: WritePrecisionType;
}
