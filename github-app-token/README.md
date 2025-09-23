# GitHub Action: GitHub App Token

[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

## Description

This GitHub Action installs the Octokit libraries and authenticates with GitHub
using an App token.

## Author

### Digdir Platform Team

## Initial Setup

1. Install dependencies

   ```bash
   npm install
   ```

1. Package the TypeScript for distribution

   ```bash
   npm run bundle
   ```

1. Run tests

   ```bash
   npm test
   ```

## Inputs

- `app-id`:

  - **Description**: The ID of the GitHub App.
  - **Required**: true
  - **Type**: string

- `private-key`:

  - **Description**: The private key of the GitHub App.
  - **Required**: true
  - **Type**: string

- `installation-id`:

  - **Description**: The ID of the installation.
  - **Required**: true
  - **Type**: string

- `repository`:

  - **Description**: The repository name. If not provided, it defaults to the
    current repository.
  - **Required**: false
  - **Type**: string

## Outputs

- `token`:

  - **Description**: The authentication token.
  - **Type**: string

## Example Usage

```yaml
name: Authenticate

on:
  push:
    branches:
      - main

jobs:
  authenticate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@08c6903cd8c0fde910a37f88322edcfb5dd907a8 # pin@v5.0.0

      - name: Generate Token
        id: generate-token
        uses: felleslosninger/github-actions/github-app-token@v1
        with:
          app-id: ${{ secrets.APP_ID }}
          private-key: ${{ secrets.PRIVATE_KEY }}
          installation-id: ${{ secrets.INSTALLATION_ID }}

      - name: Use Token
        run: echo "Token is ${{ steps.generate-token.outputs.token }}"
```

## How it Works

This action authenticates with GitHub using the provided GitHub App ID, Private
Key, and Installation ID. It then retrieves an authentication token and outputs
it for further use.
