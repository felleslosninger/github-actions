import { Point } from "@influxdata/influxdb-client";
import { write } from "../src/helpers/summary";
import * as core from "@actions/core";

jest.mock("@actions/core");

describe("writeSummary", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls core.summary methods correctly", () => {
    // Mock core.summary methods using spyOn
    const addHeadingSpy = jest
      .spyOn(core.summary, "addHeading")
      .mockReturnThis();

    const addCodeBlockSpy = jest
      .spyOn(core.summary, "addCodeBlock")
      .mockReturnThis();

    const writeSpy = jest.spyOn(core.summary, "write").mockReturnThis();

    // Create a sample point
    const point = new Point("foo");

    // Call the function
    write(point);

    // Verify that core.summary methods are called correctly
    expect(addHeadingSpy).toHaveBeenCalledWith("JSON Data", 3);
    expect(addCodeBlockSpy).toHaveBeenCalledWith(
      JSON.stringify(point, null, "\t"),
      "json"
    );
    expect(writeSpy).toHaveBeenCalled();
  });
});
