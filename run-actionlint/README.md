# GitHub Action: Run actionlint

## Description

This GitHub Action runs actionlint, which is a static checker for GitHub Actions workflow files. It helps ensure the validity and correctness of your GitHub Actions workflows.

## Author

**Digdir Plattform Team**

## Usage

```yaml
name: Syntax check workflows files (actionlint)
run-name: "actionlint"
on: [push]

jobs:
  actionlint:
    runs-on: ubuntu-latest
    steps:
      - name: "Run actionlint"
        uses: felleslosninger/github-actions/run-actionlint@v1
```

## How it Works

This action uses a composite run to execute a Bash script that downloads and runs actionlint, a static checker for GitHub Actions workflow files.
