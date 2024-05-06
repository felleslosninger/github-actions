import { addJiraLinks, addPullRequestLinks } from "../src/helpers/links-helper";
import { describe, it, expect } from "@jest/globals";

describe("addPullRequestLinks", () => {
  it("replaces Jira IDs and pull-request numbers with links", () => {
    // arrange
    const baseUrl = "https://your-jira-instance.com";
    const releaseNotes = [
      "MP-526: Kombinert NoHandler- og NoResource-Exception til en. Fjernet logging av stack-trace. (#432)",
      "MP-499: Legge til security.txt (#433)",
      "MP-511: Legg til source rammeverk og triggering av rett source authorization (#429)",
      "MP-503: Legg til model og interface for authorization_details (#425)"
    ];

    // act
    const result = addPullRequestLinks(baseUrl, releaseNotes);

    // assert
    expect(result[0]).toBe(
      `MP-526: Kombinert NoHandler- og NoResource-Exception til en. Fjernet logging av stack-trace. ([#432](${baseUrl}/pull/432))`
    );

    expect(result[1]).toBe(
      `MP-499: Legge til security.txt ([#433](${baseUrl}/pull/433))`
    );

    expect(result[2]).toBe(
      `MP-511: Legg til source rammeverk og triggering av rett source authorization ([#429](${baseUrl}/pull/429))`
    );

    expect(result[3]).toBe(
      `MP-503: Legg til model og interface for authorization_details ([#425](${baseUrl}/pull/425))`
    );
  });

  it("handles release notes with no Jira IDs or pull-request numbers", () => {
    // arrange
    const baseUrl = "https://your-jira-instance.com";
    const releaseNotes = ["Fix 12 bugs", "Update documentation"];

    // act
    const result = addPullRequestLinks(baseUrl, releaseNotes);

    // assert
    expect(result[0]).toBe("Fix 12 bugs");
    expect(result[1]).toBe("Update documentation");
  });

  it("handles release notes with mixed content", () => {
    // arrange
    const baseUrl = "https://your-jira-instance.com";
    const releaseNotes = [
      "Fix some bugs (#123)",
      "Add feature MP-123",
      "Update documentation (#456)"
    ];

    // act
    const result = addPullRequestLinks(baseUrl, releaseNotes);

    // assert
    expect(result[0]).toBe(`Fix some bugs ([#123](${baseUrl}/pull/123))`);

    expect(result[1]).toBe("Add feature MP-123");

    expect(result[2]).toBe(
      `Update documentation ([#456](${baseUrl}/pull/456))`
    );
  });
});

describe("addJiraLinks", () => {
  it("replaces Jira IDs and pull-request numbers with links", () => {
    // arrange
    const baseUrl = "https://your-jira-instance.com";
    const releaseNotes = [
      "MP-526: Kombinert NoHandler- og NoResource-Exception til en. Fjernet logging av stack-trace. (#432)",
      "MP-499: Legge til security.txt (#433)",
      "MP-511: Legg til source rammeverk og triggering av rett source authorization (#429)",
      "MP-503: Legg til model og interface for authorization_details (#425)"
    ];

    // act
    const result = addJiraLinks(baseUrl, releaseNotes);

    // assert
    expect(result[0]).toBe(
      `[MP-526](${baseUrl}/browse/MP-526): Kombinert NoHandler- og NoResource-Exception til en. Fjernet logging av stack-trace. (#432)`
    );

    expect(result[1]).toBe(
      `[MP-499](${baseUrl}/browse/MP-499): Legge til security.txt (#433)`
    );

    expect(result[2]).toBe(
      `[MP-511](${baseUrl}/browse/MP-511): Legg til source rammeverk og triggering av rett source authorization (#429)`
    );

    expect(result[3]).toBe(
      `[MP-503](${baseUrl}/browse/MP-503): Legg til model og interface for authorization_details (#425)`
    );
  });

  it("handles release notes with no Jira IDs or pull-request numbers", () => {
    // arrange
    const baseUrl = "https://your-jira-instance.com";
    const releaseNotes = ["Fix 12 bugs", "Update documentation"];

    // act
    const result = addJiraLinks(baseUrl, releaseNotes);

    // assert
    expect(result[0]).toBe("Fix 12 bugs");
    expect(result[1]).toBe("Update documentation");
  });

  it("handles release notes with mixed content", () => {
    // arrange
    const baseUrl = "https://your-jira-instance.com";
    const releaseNotes = [
      "Fix some bugs (#123)",
      "Add feature MP-123",
      "Update documentation (#456)"
    ];

    // act
    const result = addJiraLinks(baseUrl, releaseNotes);

    // assert
    expect(result[0]).toBe("Fix some bugs (#123)");
    expect(result[1]).toContain(
      `Add feature [MP-123](${baseUrl}/browse/MP-123)`
    );
    expect(result[2]).toBe("Update documentation (#456)");
  });
});
