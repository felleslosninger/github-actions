# Digdir GitHub Actions Repository

[![Bats Tests](https://github.com/felleslosninger/github-actions/actions/workflows/run-bats-tests.yml/badge.svg)](https://github.com/felleslosninger/github-actions/actions/workflows/run-bats-tests.yml)
[![Run Jest Tests](https://github.com/felleslosninger/github-actions/actions/workflows/run-jest-tests.yml/badge.svg)](https://github.com/felleslosninger/github-actions/actions/workflows/run-jest-tests.yml)
[![Lint Codebase](https://github.com/felleslosninger/github-actions/actions/workflows/linter.yml/badge.svg)](https://github.com/felleslosninger/github-actions/actions/workflows/linter.yml)

Welcome to the GitHub Actions Repository for Digdir!
This repository contains a collection of custom GitHub Actions developed by the Digdir Platform Team to automate various tasks in our workflows.

## Actions

### [Create Grafana Annotation](./create-grafana-annotation/README.md)

This GitHub Action is designed to add deployment text annotations to Grafana dashboards, enhancing observability and tracking changes effectively.

### [Check if File Exists](./file-exists/README.md)

This GitHub Action checks if a specified file exists within the repository. It provides an output indicating whether the file exists or not.

### [JSON to Summary](./json-to-summary/README.md)

This GitHub Action enables you to write JSON content to the workflow summary, presenting structured data in a clear and readable format in the GitHub Actions UI.

### [Run ActionLint](./run-actionlint/README.md)

ActionLint is a tool for linting GitHub Actions workflow files to ensure they adhere to best practices and standards. This GitHub Action integrates ActionLint into your workflows, helping maintain code quality.

### [Send Slack Notification](./send-slack-notification/README.md)

This GitHub Action notifies designated Slack channels about workflow events, enabling teams to stay informed and facilitate rapid response and resolution.

### [Write to InfluxDB](./write-to-influxdb/README.md)

This GitHub Action allows you to write data to InfluxDB, a time-series database. It's useful for storing and analyzing time-stamped data, such as metrics and events.

### [Publish Release Notes](./publish-release-notes/README.md)

This GitHub Action automates the process of publishing release notes to a repository based on specified inputs. It extracts release notes from the provided input and, if conditions are met, publishes them to the designated repository. Additionally, it dispatches events for updating the changelog.

### [GitHub App Token](./github-app-token/README.md)

This GitHub Action authenticates with GitHub using an App ID, Private Key, Installation ID, and generates a token.

## License

These GitHub Actions are open-source and distributed under the [MIT License](LICENSE). Feel free to use, modify, and distribute them according to your needs.
