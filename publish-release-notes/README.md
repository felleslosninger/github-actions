# GitHub Action: Publish Release Notes

## Description

This GitHub Action automates the process of publishing release notes to a
repository based on specified inputs. It extracts release notes from the
provided input and, if conditions are met, it dispatches events for updating the
release notes.

## Author

**Digdir Platform Team**

## Initial Setup

1. Install dependencies

   ```bash
   npm install
   ```

1. Run tests

   ```bash
   npm test
   ```

## Inputs

- `application-name`:

  - **Description**: The name of the application for which release notes are
    generated.
  - **Required**: true
  - **Type**: string

- `product`:

  - **Description**: The product associated with the release.
  - **Required**: true
  - **Type**: string

- `version`:

  - **Description**: The version number of the release.
  - **Required**: true
  - **Type**: string

- `release-notes`:

  - **Description**: The release notes content.
  - **Required**: true
  - **Type**: string

- `timestamp`:

  - **Description**: The timestamp of the release.
  - **Required**: true
  - **Type**: string

- `github-token`:

  - **Description**: The GitHub token for authentication.
  - **Required**: true
  - **Type**: string

- `repository-owner`:

  - **Description**: The owner of the repository to which release notes will be
    published.
  - **Required**: true
  - **Type**: string

- `repository-name`:

  - **Description**: The name of the repository to which release notes will be
    published.
  - **Required**: true
  - **Type**: string

- `sha`:

  - **Description**: The commit SHA associated with the release.
  - **Required**: true
  - **Type**: string

- `ignore-products`:

  - **Description**: Comma seperated list of product(s) to ignore when
    publishing release notes.
  - **Required**: false
  - **Default**: ""
  - **Type**: string

- `ignore-applications`:

  - **Description**: Comma seperated list of application(s) to ignore when
    publishing release notes.
  - **Required**: false
  - **Default**: ""
  - **Type**: string

- `dependabot-replacement`:

  - **Description**: Replacement string for "Bump" commits. If multiple are
    present, they will all be replaced with a single line.
  - **Required**: false
  - **Type**: string

- `ignore-commits`:

  - **Description**: Commits to ignore when publishing release notes.
  - **Required**: false
  - **Type**: string

- `title`:

  - **Description**: Title to use for public release notes entry (default is
    "product" variable).
  - **Required**: false
  - **Type**: string

## Example Usage

```yaml
name: Publish Release Notes

on:
  push:
    branches:
      - main

jobs:
  publish-release-notes:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v2

      - name: Publish Release Notes
        uses: felleslosninger/github-actions/publish-release-notes@v1.0.0
        with:
          application-name: "YourApp"
          product: "YourProduct"
          version: "1.0.0"
          release-notes: "Your release notes here"
          timestamp: "2024-02-29T12:00:00Z"
          github-token: ${{ secrets.GITHUB_TOKEN }}
          repository-owner: "your-username"
          repository-name: "your-repository"
          sha: "your-commit-sha"
          isPublic: true
          public-ignore-products: ""
          public-ignore-applications: ""
          public-title: "Your Public Title"
```

## How it Works

This action reads inputs provided in the workflow file and processes them to
determine whether release notes should be published. If the conditions for
publishing are met, it proceeds to dispatch an event for updating the release
notes.
