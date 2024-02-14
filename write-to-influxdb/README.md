# GitHub Action: Write To InfluxDB

[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

## Description

This GitHub Action allows you to write data to InfluxDB, a time-series database.
It's useful for storing and analyzing time-stamped data, such as metrics and
events.

## Author

**Digdir Platform Team**

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

- `json`:

  - **Description**: Tags and fields data to be written to InfluxDB.
  - **Required**: true
  - **Type**: string

- `influxdb-url`:

  - **Description**: The URL of the InfluxDB instance where data will be
    written.
  - **Required**: true
  - **Type**: string

- `influxdb-token`:

  - **Description**: The InfluxDB authentication token.
  - **Required**: true
  - **Type**: string

- `organization`:

  - **Description**: The organization name within InfluxDB.
  - **Required**: true
  - **Type**: string

- `bucket`:

  - **Description**: The name of the bucket in InfluxDB where data will be
    stored.
  - **Required**: true
  - **Type**: string

- `measurement-name`:

  - **Description**: The name of the measurement in InfluxDB.
  - **Required**: true
  - **Type**: string

- `precision`:

  - **Description**: The precision of the timestamps in the data. Default is
    "ns" (nanoseconds).
  - **Required**: false
  - **Type**: string
  - **Default**: "ns"

## Example Usage

```yaml
name: Write Data to InfluxDB

on:
  push:
    branches:
      - main

jobs:
  write-to-influxdb:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v2

      - name: Write Data to InfluxDB
        uses: felleslosninger/github-actions/write-to-influxdb@v1.0.0
        with:
          json: '{"tags":{"repository":"felleslosninger/test-app","application":"test-app"},"stringFields":{"version":"a9dea392","deployment_started":"1990-01-01T09:55:09Z","deployment_finished":"1990-01-01T09:55:10Z"}}'
          influxdb-url: "https://your-influxdb-instance.com"
          influxdb-token: ${{ secrets.INFLUXDB_TOKEN }}
          organization: "your-organization"
          bucket: "your-bucket"
          measurement-name: "your-measurement-name"
          precision: "s"
```

## How it Works

This action is written in TypeScript and utilizes the InfluxDB JavaScript client
library to connect to an InfluxDB instance. It converts the provided JSON data
into a data point and writes it to the specified InfluxDB measurement within the
specified organization and bucket. The action also provides an option to
customize the precision of timestamps in the data.
