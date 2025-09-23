# GitHub Action: Write JSON to Workload Summary

## Description

This GitHub Action is designed to write JSON content to the workflow summary. It enables you to present structured data in a clear and readable format in the GitHub Actions UI. The action accepts a JSON input and an optional title.

## Author

**Digdir Plattform Team**

## Inputs

- `json`:

  - **Description**: The JSON content to be displayed in the workflow summary.
  - **Required**: true

- `title`:
  - **Description**: An optional title for the JSON content.
  - **Required**: false
  - **Default**: "JSON"

## Example Usage

```yaml
name: Your Workflow Name

on:
  push:
    branches:
      - main

jobs:
  write-json-to-summary:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@08c6903cd8c0fde910a37f88322edcfb5dd907a8 # pin@v5.0.0

      - name: Write JSON to Workload Summary
        uses: felleslosninger/github-actions/json-to-summary@v1
        with:
          json: '{"key": "value"}'
          title: "Custom Title"
```

## How it Works

This action uses a composite run to execute a Bash script. The script dynamically constructs a Markdown-formatted section in the workflow summary, including the specified title and JSON content.
