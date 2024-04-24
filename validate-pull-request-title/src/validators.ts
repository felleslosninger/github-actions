import { ValidationResult } from "./interfaces";
import * as core from "@actions/core";

export async function validateInputs(): Promise<{
  pullRequestTitle: string;
  caseSensitivePrefix: boolean;
  maxLengthTitle: number;
  minLengthTitle: number;
  allowedPrefixes: string[];
}> {
  const pullRequestTitle: string = core.getInput("pull-request-title", {
    required: true
  });
  const caseSensitivePrefix: boolean = core.getBooleanInput(
    "case-sensitive-prefix"
  );
  const maxLengthTitle: number = parseInt(core.getInput("max-length-title"));
  const minLengthTitle: number = parseInt(core.getInput("min-length-title"));
  const allowedPrefixes: string[] = core
    .getInput("allowed-prefixes")
    .split(",");

  if (isNaN(maxLengthTitle) || isNaN(minLengthTitle)) {
    throw new Error(
      "Invalid input: max-length-title and min-length-title must be numeric."
    );
  }

  if (minLengthTitle < 1) {
    throw new Error("Invalid input: min-length-title must be greater than 0.");
  }

  if (maxLengthTitle > 0 && maxLengthTitle < minLengthTitle) {
    throw new Error(
      "Invalid input: max-length-title cannot be smaller than min-length-title."
    );
  }

  return {
    pullRequestTitle,
    caseSensitivePrefix,
    maxLengthTitle,
    minLengthTitle,
    allowedPrefixes
  };
}

export function validateTitlePrefix(
  title: string,
  prefix: string,
  caseSensitive: boolean
): boolean {
  return caseSensitive
    ? title.startsWith(prefix)
    : title.toLowerCase().startsWith(prefix.toLowerCase());
}

export function validateTitleLength(
  title: string,
  minLength: number,
  maxLength: number
): ValidationResult {
  const length = title.length;
  if (length < minLength) {
    return {
      isValid: false,
      message: `Title is smaller than the minimum length - ${minLength}`
    };
  }
  if (maxLength > 0 && length > maxLength) {
    return {
      isValid: false,
      message: `Title is greater than the maximum length - ${maxLength}`
    };
  }
  return { isValid: true };
}

export function validateTitlePrefixes(
  title: string,
  allowedPrefixes: string[],
  caseSensitive: boolean
): ValidationResult {
  if (allowedPrefixes.length === 0) return { isValid: true }; // No prefixes defined, skip validation
  if (
    !allowedPrefixes.some(prefix =>
      validateTitlePrefix(title, prefix, caseSensitive)
    )
  ) {
    return {
      isValid: false,
      message: `Title did not start with any of the required prefixes - ${allowedPrefixes.join(", ")}`
    };
  }
  return { isValid: true };
}
