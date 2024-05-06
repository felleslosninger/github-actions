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
      `MP-526: Kombinert NoHandler- og NoResource-Exception til en. Fjernet logging av stack-trace. (<a href="${baseUrl}/pull/432" target="_blank">#432</a>)`
    );

    expect(result[1]).toBe(
      `MP-499: Legge til security.txt (<a href="${baseUrl}/pull/433" target="_blank">#433</a>)`
    );

    expect(result[2]).toBe(
      `MP-511: Legg til source rammeverk og triggering av rett source authorization (<a href="${baseUrl}/pull/429" target="_blank">#429</a>)`
    );

    expect(result[3]).toBe(
      `MP-503: Legg til model og interface for authorization_details (<a href="${baseUrl}/pull/425" target="_blank">#425</a>)`
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
    expect(result[0]).toBe(
      `Fix some bugs (<a href="${baseUrl}/pull/123" target="_blank">#123</a>)`
    );

    expect(result[1]).toBe("Add feature MP-123");

    expect(result[2]).toBe(
      `Update documentation (<a href="${baseUrl}/pull/456" target="_blank">#456</a>)`
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
    expect(result[0]).toContain(
      `<a href="${baseUrl}/browse/MP-526" target="_blank">MP-526</a>`
    );

    expect(result[1]).toContain(
      `<a href="${baseUrl}/browse/MP-499" target="_blank">MP-499</a>`
    );

    expect(result[2]).toContain(
      `<a href="${baseUrl}/browse/MP-511" target="_blank">MP-511</a>`
    );

    expect(result[3]).toContain(
      `<a href="${baseUrl}/browse/MP-503" target="_blank">MP-503</a>`
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
      `Add feature <a href="${baseUrl}/browse/MP-123" target="_blank">MP-123</a>`
    );
    expect(result[2]).toBe("Update documentation (#456)");
  });
});
