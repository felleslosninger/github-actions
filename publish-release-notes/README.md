# GitHub Action: Publish Release Notes

## Description

This GitHub Action automates the process of publishing release notes to a
repository based on specified inputs. It extracts release notes from the
provided input and, if conditions are met, publishes them to the designated
repository. Additionally, it dispatches events for updating the changelog.

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

- `isPublic`:

  - **Description**: Flag indicating whether the release is public.
  - **Required**: true
  - **Type**: boolean

- `public-ignore-products`:

  - **Description**: List of products to ignore for public releases.
  - **Required**: false
  - **Type**: string

- `public-ignore-applications`:

  - **Description**: List of applications to ignore for public releases.
  - **Required**: false
  - **Type**: string

- `public-title`:
  - **Description**: The title of the public release (defaults to `product` if
    not supplied)
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
publishing are met, it proceeds to publish the release notes to the designated
repository. Additionally, it dispatches events for updating the changelog.
