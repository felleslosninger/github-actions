# Digdir GitHub Actions Repository

[![Bats Tests](https://github.com/felleslosninger/github-actions/actions/workflows/internal-run-bats-tests.yml/badge.svg)](https://github.com/felleslosninger/github-actions/actions/workflows/internal-run-bats-tests.yml)
[![Run Jest Tests](https://github.com/felleslosninger/github-actions/actions/workflows/internal-run-jest-tests.yml/badge.svg)](https://github.com/felleslosninger/github-actions/actions/workflows/internal-run-jest-tests.yml)
[![Lint Codebase](https://github.com/felleslosninger/github-actions/actions/workflows/internal-linter.yml/badge.svg)](https://github.com/felleslosninger/github-actions/actions/workflows/internal-linter.yml)

Welcome to the GitHub Actions Repository for Digdir!
This repository contains a collection of custom GitHub Actions developed by the Digdir Platform Team to automate various tasks in our workflows.

## Actions

### [Create Grafana Annotation](./create-grafana-annotation/README.md)

This GitHub Action is designed to add deployment text annotations to Grafana dashboards, enhancing observability and tracking changes effectively.

### [File Exists](./file-exists/README.md)

This GitHub Action checks if a specified file exists within the repository. It provides an output indicating whether the file exists or not.

### [Get Release Notes](./get-release-notes/README.md)

This GitHub Action retrieves release notes based on the comparison between two commit SHAs in a GitHub repository. It provides an array of release notes as output.

### [GitHub App Token](./github-app-token/README.md)

This GitHub Action authenticates with GitHub using an App ID, Private Key, Installation ID, and generates a token.

### [JSON to Summary](./json-to-summary/README.md)

This GitHub Action enables you to write JSON content to the workflow summary, presenting structured data in a clear and readable format in the GitHub Actions UI.

### [Publish Release Notes](./publish-release-notes/README.md)

This GitHub Action automates the process of publishing release notes to a repository based on specified inputs. It extracts release notes from the provided input and, if conditions are met, dispatches an event for updating the releas notes.

### [Run ActionLint](./run-actionlint/README.md)

ActionLint is a tool for linting GitHub Actions workflow files to ensure they adhere to best practices and standards. This GitHub Action integrates ActionLint into your workflows, helping maintain code quality.

### [Send Slack Notification](./send-slack-notification/README.md)

This GitHub Action notifies designated Slack channels about workflow events, enabling teams to stay informed and facilitate rapid response and resolution.

### [Validate Pull Request Title](./validate-pull-request-title/README.md)

The Validate Pull Request Title GitHub Action checks if the title of a pull request meets specified criteria, including length constraints and required prefixes. It helps maintain consistency and clarity in pull request titles within your repository.

### [Write to InfluxDB](./write-to-influxdb/README.md)

This GitHub Action allows you to write data to InfluxDB, a time-series database. It's useful for storing and analyzing time-stamped data, such as metrics and events.

## Publishing a New Release

To publish a new release, follow these steps:

1. Create a new signed tag:

   ```bash
   git tag -s -a v0.7.4 -m "v0.7.4"
   ```

2. Push the tag to the origin repository:

   ```bash
   git push origin v0.7.4
   ```

3. This will trigger the internal-publish-release.yml workflow.

> [!IMPORTANT]
> Make sure to replace v0.7.4 with your actual version number.

## Development Workflow

### Pre-commit Hooks

This repository uses [Husky](https://typicode.github.io/husky/) with [lint-staged](https://github.com/lint-staged/lint-staged) to run automated checks before commits:

**What runs automatically on changed files:**
- ✨ **Prettier** - Auto-formats code (TypeScript/JavaScript)
- 🔍 **ESLint** - Lints code for errors and style issues
- 📝 **TypeScript** - Type checking on changed modules
- 📋 **License Check** - Verifies all dependencies have compatible licenses

**How it works:**
1. You stage files with `git add`
2. On commit, `lint-staged` runs:
   - Prettier formats your staged `.ts` and `.js` files
   - ESLint checks the formatted files
3. Then checks run on changed modules:
   - TypeScript type checking (`tsc --noEmit`)
   - License compatibility check
4. If all checks pass, the commit succeeds
5. If any check fails, the commit is blocked

**Benefits:**
- Only changed files are processed (fast!)
- Auto-formatting means less manual work
- Catches issues before they reach CI/CD
- Ensures license compliance

### Manual Commands

#### Lint a specific module:
```bash
cd get-release-notes
npm run lint              # ESLint
npm run format:check      # Prettier check
npm run format:write      # Prettier auto-fix
npm run lisenssjekk       # License check
npx tsc --noEmit          # Type check
```

#### Run checks on all modules:
```bash
npm run lint:all          # Lint all modules
npm run license:all       # Check licenses in all modules
npm run type-check:all    # Type check all modules
```

### Skipping Hooks (Not Recommended)

If you absolutely need to bypass the pre-commit hook:
```bash
git commit --no-verify
```

⚠️ **Warning:** GitHub Actions will still run all checks as a safety net. Skipping hooks locally just delays finding issues.

### CI/CD Checks

GitHub Actions runs the following checks on every PR and push to main:

1. **License Check** - Verifies all dependencies use approved licenses
2. **Prettier** - Ensures code is properly formatted
3. **ESLint** - Checks for code quality and errors
4. **TypeScript** - Type checking with `tsc --noEmit`
5. **Tests** - Runs Jest test suites

New Actions should be added to the [internal-linter.yml](.github/workflows/internal-linter.yml) workflow.

### Approved Licenses

The following licenses are approved for use:
- MIT
- Apache-2.0
- BSD-3-Clause / BSD-2-Clause
- ISC
- BlueOak-1.0.0
- CC-BY-3.0 / CC-BY-4.0 / CC0-1.0
- 0BSD
- Python-2.0

## Creating a new Github Action

New actions should be generated using [typescript-action](https://github.com/actions/typescript-action) template.

## License

These GitHub Actions are open-source and distributed under the [MIT License](LICENSE). Feel free to use, modify, and distribute them according to your needs.
