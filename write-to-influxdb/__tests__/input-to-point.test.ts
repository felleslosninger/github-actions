import { Point } from "@influxdata/influxdb-client";
import { toPoint } from "../src/converters/input-to-point";

describe("convertToPoint", () => {
  it("converts input data to Point object correctly", () => {
    const measurementName = "testMeasurement";
    const inputData = {
      tags: { tag1: "value1", tag2: "value2" },
      stringFields: { field1: "value1", field2: "value2" }
    };

    const expectedPoint = new Point(measurementName)
      .tag("tag1", "value1")
      .tag("tag2", "value2")
      .stringField("field1", "value1")
      .stringField("field2", "value2");

    expect(toPoint(measurementName, inputData)).toEqual(expectedPoint);
  });
});
