# GitHub Action: Write Deployment To Grafana

## Description

This GitHub Action is designed to write deployment text annotations to Grafana dashboards. It allows you to annotate Grafana dashboards with deployment information, enhancing observability and tracking changes effectively.

## Author

**Digdir Platform Team**

## Inputs

- `dashboard-id`:
  - **Description**: The ID of the Grafana dashboard where the annotation will be added.
  - **Required**: true
  - **Type**: string

- `panel-id`:
  - **Description**: The ID of the panel within the Grafana dashboard where the annotation will be placed.
  - **Required**: true
  - **Type**: string

- `annotation-text`:
  - **Description**: The text content of the annotation to be added.
  - **Required**: true
  - **Type**: string

- `grafana-token`:
  - **Description**: The Grafana API token with write permissions required to add annotations.
  - **Required**: true
  - **Type**: string

- `annotation-url`:
  - **Description**: The URL associated with the annotation (optional).
  - **Type**: string
  - **Default**: ""

## Example Usage

```yaml
name: Your Workflow Name

on:
  push:
    branches:
      - main

jobs:
  write-deployment-to-grafana:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@0ad4b8fadaa221de15dcec353f45205ec38ea70b # pin@v4.1.4

      - name: Write Deployment To Grafana
        uses: felleslosninger/github-actions/create-grafana-annotation@v1
        with:
          dashboard-id: "12345"
          panel-id: "67890"
          annotation-text: "Deployment completed successfully"
          grafana-token: ${{ secrets.GRAFANA_TOKEN }}
          annotation-url: "https://example.com/deployment-details"
```

## How it Works
This action utilizes a composite run to execute a Bash script. 
The script constructs a JSON payload representing the annotation and sends a POST request to the Grafana API to add the annotation to the specified dashboard and panel. 
It then logs the HTTP response code for verification.
