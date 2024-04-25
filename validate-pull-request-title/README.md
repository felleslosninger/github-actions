# Validate Pull Request Title

[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

## Description

The **Validate Pull Request Title** GitHub Action checks if the title of a pull
request meets specified criteria, including length constraints and required
prefixes. It helps maintain consistency and clarity in pull request titles
within your repository.

## Usage

To use this action, you need to provide the following inputs:

- `pull-request-title`: The title of the pull request. (required)
- `case-sensitive-prefix`: Whether to enforce case sensitivity for prefixes.
  Defaults to true. (optional)
- `max-length-title`: The maximum allowed length for the pull request title.
  Defaults to "100" characters. (optional)
- `min-length-title`: The minimum required length for the pull request title.
  Defaults to "10" characters. (optional)
- `allowed-prefixes`: A comma-separated list of prefixes that are allowed in
  pull request titles. (required)

## Example Workflow

```yaml
name: Validate Pull Request Title Example

on:
  pull_request:
    types: [opened]

jobs:
  validate-title:
    runs-on: ubuntu-latest
    steps:
      - name: Check out repository
        uses: actions/checkout@v2

      - name: Validate Pull Request Title
        id: validate-title
        uses: felleslosninger/validate-pull-request-title@v1
        with:
          pull-request-title: ${{ github.event.pull_request.title }}
          allowed-prefixes: "fix,feat,docs,refactor,chore"

      - name: Print validation result
        run: echo "Is title valid? ${{ steps.validate-title.outputs.is-valid }}"
```

## Inputs

### `pull-request-title`

The title of the pull request.

### `case-sensitive-prefix`

Whether to enforce case sensitivity for prefixes. Defaults to true.

### `max-length-title`

The maximum allowed length for the pull request title.

### `min-length-title`

The minimum required length for the pull request title.

### `allowed-prefixes`

A comma-separated list of prefixes that are allowed in pull request titles.

## Outputs

### `is-valid`

A boolean indicating whether the pull request title is valid.

## License

This action is licensed under the [MIT License](LICENSE).

## Contribution

Contributions are welcome! Feel free to open an issue or submit a pull request.

## Credits

This action is maintained by the Digdir Platform Team.
