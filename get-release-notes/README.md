# Get Release Notes

[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

## Description

Get Release Notes is a GitHub Action that retrieves release notes based on the
comparison between two commit SHAs in a GitHub repository.

## Usage

To use this action, you need to provide the following inputs:

- `repository`: Name of the application repository (required)
- `head`: Head commit SHA (required)
- `base`: Base commit SHA (required)
- `application-path`: Optional repository path for the application (useful in a monorepo)
  (default: all paths)
- `github-token`: GitHub token for authentication (required)
- `show-pull-request-links`: Show PR numbers as links (optional, default: false)
- `pull-request-base-url`: Pull-request base URL (optional, but required if
  show-pull-request-links = true)
- `show-jira-links`: Show Jira IDs as links (optional, default: false)
- `jira-base-url`: Jira base URL (optional, but required if show-jira-links =
  true)

## Example Workflow

```yaml
name: Get Release Notes Example

on:
  push:
    branches:
      - main

jobs:
  get-release-notes:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@08c6903cd8c0fde910a37f88322edcfb5dd907a8 # pin@v5.0.0

      - name: Get Release Notes
        id: release-notes
        uses: felleslosninger/get-release-notes@v1
        with:
          repository: your-repo-name
          head: ${{ github.event.after }}
          base: ${{ github.event.before }}
          application-path: apps/your-application
          github-token: ${{ secrets.GITHUB_TOKEN }}
          show-pull-request-links: true
          pull-request-base-url: https://your-pull-request-url.com
          show-jira-links: true
          jira-base-url: https://your-jira-url.com

      - name: Display Release Notes
        run: echo "${{ steps.release-notes.outputs.release-notes }}"
```

## Inputs

### `repository`

Name of the application repository.

### `head`

Head commit SHA to compare.

### `base`

Base commit SHA to compare.

### `application-path`

Optional path to the application in the repository. When supplied, only
commits that changed files under this path are included in the release notes.
This is useful when several applications share one repository.

### `github-token`

GitHub token for authentication.

### `show-pull-request-links`

Show PR numbers as links.

### `pull-request-base-url`

Pull-request base URL.

### `show-jira-links`

Show Jira IDs as links.

### `jira-base-url`

Jira base URL.

## Outputs

### `release-notes`

An array of release notes generated from the comparison between the head and
base commits.

## License

This action is licensed under the [MIT License](LICENSE).

## Contribution

Contributions are welcome! Feel free to open an issue or submit a pull request.

## Credits

This action is maintained by the Digdir Platform Team.
