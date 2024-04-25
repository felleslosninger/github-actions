import * as core from "@actions/core";
import {
  validateInputs,
  validateTitleLength,
  validateTitlePrefixes
} from "./validators";

export async function run(): Promise<void> {
  try {
    const {
      pullRequestTitle,
      caseSensitivePrefix,
      maxLengthTitle,
      minLengthTitle,
      allowedPrefixes
    } = await validateInputs();

    const lengthValidation = validateTitleLength(
      pullRequestTitle,
      minLengthTitle,
      maxLengthTitle
    );
    if (!lengthValidation.isValid) {
      core.setOutput("is-valid", false);
      return;
    }

    const prefixesValidation = validateTitlePrefixes(
      pullRequestTitle,
      allowedPrefixes,
      caseSensitivePrefix
    );
    if (!prefixesValidation.isValid) {
      core.setOutput("is-valid", false);
      return;
    }

    core.info("Pull Request title validation passed.");
    core.setOutput("is-valid", true);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(`Failed to validate pull request title: ${error.message}`);
    } else {
      core.setFailed("Failed to validate pull request title: Unknown error");
    }
  }
}
