# GitHub Action: Run actionlint

## Description

This GitHub Action runs actionlint, which is a static checker for GitHub Actions workflow files. It helps ensure the validity and correctness of your GitHub Actions workflows.

## Author

**Digdir Plattform Team**

## Usage

```yaml
name: Your Workflow Name

on:
  push:
    branches:
      - main

jobs:
  run-actionlint:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Download actionlint
        id: download-actionlint
        run: bash <(curl https://raw.githubusercontent.com/rhysd/actionlint/main/scripts/download-actionlint.bash)
        shell: bash

      - name: Check workflow files
        run: ${{ steps.download-actionlint.outputs.executable }} -color
        shell: bash
```

## How it Works

This action uses a composite run to execute a Bash script that downloads and runs actionlint, a static checker for GitHub Actions workflow files.
