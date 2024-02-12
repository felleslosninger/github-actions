import * as core from "@actions/core";
import { InputData } from "./interfaces/input-data.interface";

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const jsonAsString: string = core.getInput("json");

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug(`JSON string: ${jsonAsString}`);

    const jsonObject = JSON.parse(jsonAsString);

    const inputData = jsonObject as InputData;

    for (const tag of inputData.tags) {
      core.debug(`Tag key: ${tag.key}, Tag value: ${tag.value}`);
    }

    for (const stringField of inputData.stringFields) {
      core.debug(
        `StringField key: ${stringField.key}, StringField value: ${stringField.value}`
      );
    }

    // Set outputs for other workflow steps to use
    core.setOutput("time", new Date().toTimeString());
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message);
  }
}
