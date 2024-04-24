import { describe, it, expect } from "@jest/globals";
import * as Validators from "../src/validators";

describe("validateInputs", () => {
  it("loads inputs correctly", async () => {
    // act
    const {
      pullRequestTitle,
      caseSensitivePrefix,
      maxLengthTitle,
      minLengthTitle,
      allowedPrefixes
    } = await Validators.validateInputs();

    // assert
    expect(pullRequestTitle).toBe("mocked-pull-request-title");
    expect(caseSensitivePrefix).toBe(true);
    expect(maxLengthTitle).toBe(100);
    expect(minLengthTitle).toBe(10);
    expect(allowedPrefixes).toEqual(["mocked-allowed-prefixes"]);
  });
});

describe("validateTitlePrefix function", () => {
  it("should return true for case-sensitive prefix matching", () => {
    // arrange
    const title = "Hello World";
    const prefix = "Hello";
    const caseSensitive = true;

    // act
    const result = Validators.validateTitlePrefix(title, prefix, caseSensitive);

    // assert
    expect(result).toBe(true);
  });

  it("should return true for case-insensitive prefix matching", () => {
    // arrange
    const title = "Hello World";
    const prefix = "hello";
    const caseSensitive = false;

    // act
    const result = Validators.validateTitlePrefix(title, prefix, caseSensitive);

    // assert
    expect(result).toBe(true);
  });

  it("should return false for case-sensitive prefix mismatch", () => {
    // arrange
    const title = "Hello World";
    const prefix = "hello";
    const caseSensitive = true;

    // act
    const result = Validators.validateTitlePrefix(title, prefix, caseSensitive);

    // assert
    expect(result).toBe(false);
  });

  it("should return false for case-insensitive prefix mismatch", () => {
    // arrange
    const title = "Hello World";
    const prefix = "Hola";
    const caseSensitive = false;

    // act
    const result = Validators.validateTitlePrefix(title, prefix, caseSensitive);

    // assert
    expect(result).toBe(false);
  });
});

describe("validateTitleLength function", () => {
  it("should return true for title length within valid range", () => {
    // arrange
    const title = "Hello";
    const minLength = 5;
    const maxLength = 10;

    // act
    const result = Validators.validateTitleLength(title, minLength, maxLength);

    // assert
    expect(result.isValid).toBe(true);
    expect(result.message).toBeUndefined();
  });

  it("should return false with correct error message for title length smaller than minimum length", () => {
    // arrange
    const title = "Hi";
    const minLength = 5;
    const maxLength = 10;

    // act
    const result = Validators.validateTitleLength(title, minLength, maxLength);

    // assert
    expect(result.isValid).toBe(false);
    expect(result.message).toBe(
      `Title is smaller than the minimum length - ${minLength}`
    );
  });

  it("should return false with correct error message for title length greater than maximum length", () => {
    // arrange
    const title = "This is a very long title";
    const minLength = 5;
    const maxLength = 10;

    // act
    const result = Validators.validateTitleLength(title, minLength, maxLength);

    // assert
    expect(result.isValid).toBe(false);
    expect(result.message).toBe(
      `Title is greater than the maximum length - ${maxLength}`
    );
  });

  it("should return true for title length exactly at the maximum length", () => {
    // arrange
    const title = "Maximum";
    const minLength = 5;
    const maxLength = 7;

    // act
    const result = Validators.validateTitleLength(title, minLength, maxLength);

    // assert
    expect(result.isValid).toBe(true);
    expect(result.message).toBeUndefined();
  });

  it("should return true for title length exactly at the minimum length", () => {
    // arrange
    const title = "Min";
    const minLength = 3;
    const maxLength = 7;

    // act
    const result = Validators.validateTitleLength(title, minLength, maxLength);

    // assert
    expect(result.isValid).toBe(true);
    expect(result.message).toBeUndefined();
  });

  it("should return true for title length within valid range with maximum length constraint disabled", () => {
    // arrange
    const title = "A short title";
    const minLength = 5;
    const maxLength = 0; // Disabled

    // act
    const result = Validators.validateTitleLength(title, minLength, maxLength);

    // assert
    expect(result.isValid).toBe(true);
    expect(result.message).toBeUndefined();
  });
});

describe("validateTitlePrefixes function", () => {
  it("should return true if no prefixes are defined", () => {
    // arrange
    const title = "Hello World";
    const allowedPrefixes: string[] = [];
    const caseSensitive = true;

    // act
    const result = Validators.validateTitlePrefixes(
      title,
      allowedPrefixes,
      caseSensitive
    );

    // assert
    expect(result.isValid).toBe(true);
    expect(result.message).toBeUndefined();
  });

  it("should return true if title starts with any of the allowed prefixes", () => {
    // arrange
    const title = "Hello World";
    const allowedPrefixes = ["Hello", "Hola"];
    const caseSensitive = true;

    // act
    const result = Validators.validateTitlePrefixes(
      title,
      allowedPrefixes,
      caseSensitive
    );

    // assert
    expect(result.isValid).toBe(true);
    expect(result.message).toBeUndefined();
  });

  it("should return false with correct error message if title does not start with any of the allowed prefixes", () => {
    // arrange
    const title = "Bonjour World";
    const allowedPrefixes = ["Hello", "Hola"];
    const caseSensitive = true;

    // act
    const result = Validators.validateTitlePrefixes(
      title,
      allowedPrefixes,
      caseSensitive
    );

    // assert
    expect(result.isValid).toBe(false);
    expect(result.message).toBe(
      `Title did not start with any of the required prefixes - Hello, Hola`
    );
  });

  it("should return false with correct error message if title does not start with any of the allowed prefixes (case-insensitive)", () => {
    // arrange
    const title = "Bonjour World";
    const allowedPrefixes = ["hello", "hola"];
    const caseSensitive = false;

    // act
    const result = Validators.validateTitlePrefixes(
      title,
      allowedPrefixes,
      caseSensitive
    );

    // assert
    expect(result.isValid).toBe(false);
    expect(result.message).toBe(
      `Title did not start with any of the required prefixes - hello, hola`
    );
  });
});
