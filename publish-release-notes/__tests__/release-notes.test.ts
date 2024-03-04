import { filterReleaseNotes } from "../src/release-notes";

describe("filterReleaseNotes", () => {
  it('should filter out items containing "(INTERNAL-COMMIT)"', () => {
    const releaseNotes = "Bump version\nAdd feature\n(INTERNAL-COMMIT)";
    const expected = "- Library upgrades\n- Add feature";
    expect(filterReleaseNotes(releaseNotes)).toEqual(expected);
  });

  it('should replace "Bump" with "Library upgrades"', () => {
    const releaseNotes = "Bump version to 1.2.3\nAdd feature";
    const expected = "- Library upgrades\n- Add feature";
    expect(filterReleaseNotes(releaseNotes)).toEqual(expected);
  });

  it('should replace all instances of "Bump"', () => {
    const releaseNotes = "Bump version to 1.2.3\nBump version to 2.0.0";
    const expected = "- Library upgrades";
    expect(filterReleaseNotes(releaseNotes)).toEqual(expected);
  });

  it("should not modify release notes if no match found", () => {
    const releaseNotes = "Add feature\nFix bug";
    const expected = "- Add feature\n- Fix bug";
    expect(filterReleaseNotes(releaseNotes)).toEqual(expected);
  });
});
