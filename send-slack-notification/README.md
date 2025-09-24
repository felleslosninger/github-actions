# GitHub Action: Send Slack Notification

## Description

This GitHub Action is designed to notify designated Slack channels about workflow events. It enables teams to stay informed about GitHub Actions workflows, facilitating rapid response and resolution.

## Author

### Digdir Platform Team

## Inputs

- `slack-channel-id`:

  - **Description**: The ID of the Slack channel to which notifications will be sent.
  - **Required**: true
  - **Type**: string

- `slack-bot-token`:
  - **Description**: The Slack Bot token required to send notifications.
  - **Required**: true
  - **Type**: string

## Example Usage

```yaml
name: Your Workflow Name

on:
  push:
    branches:
      - main

jobs:
  send-slack-notification:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v2

      - name: Send Slack Notification
        uses: felleslosninger/github-actions/send-slack-notification@v0.2.2
        with:
          slack-channel-id: "your-slack-channel-id"
          slack-bot-token: ${{ secrets.SLACK_BOT_TOKEN }}
```

## How it Works

This action utilizes a composite run to execute various steps. It checks out the necessary tools, retrieves the commit message using GitHub script, and then notifies the specified Slack channel about the workflow event, providing essential details such as the commit message, workflow reference, repository, run ID, and committer.
