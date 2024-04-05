import * as core from "@actions/core";

export function writeSummary(
  heading: string,
  headingLevel: 1 | 2 | 3,
  body: string[]
): void {
  core.summary.addHeading(heading, headingLevel);
  core.summary.addList(body);
  core.summary.write();
}
