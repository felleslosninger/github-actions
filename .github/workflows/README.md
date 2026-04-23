## Internal workflows

### internal-linter.yml

This workflow runs super-linter for the specified folders

### internal-publish-release.yml

This workflow publishes a release when a new tag is pushed in the format `v*.*.*`.

### internal-run-bats-tests.yml

This workflow runs Bats tests on pushes to the `main` branch.

### internal-run-jest-tests.yml

This workflow runs Jest tests on pushes to the `main` branch.
