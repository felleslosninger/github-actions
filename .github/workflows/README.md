## Shared workflows

### shared-build-image.yml

This workflow builds and publishes a Docker image.

#### Inputs:

- `image-name`: Name of the Docker image.
- `image-pack`: Docker image pack (`builder-jammy-tiny`, `builder-jammy-base`, or `builder-jammy-full`).
- `java-version`: Main version of Java (default: "11").
- `container-scan-offline-mode`: Enable offline mode for container scanning (default: false).
- `slack-channel-id`: Team channel ID.

### shared-ci-cd-default.yml

This workflow builds and publishes a Docker image and then triggers subsequent workflows for additional actions.

#### Inputs:

- `java-version`: Java version.
- `slack-channel-id`: Slack channel ID.
- `application-name`: Name of the application.
- `product-name`: Name of the product.
- `kubernetes-repo`: Kubernetes repository.
- `image-name`: Name of the Docker image.
- `deployment-environment`: Deployment environment.

## Internal workflows

### internal-linter.yml

This workflow runs super-linter for the specified folders

### internal-publish-release.yml

This workflow publishes a release when a new tag is pushed in the format `v*.*.*`.

### internal-run-bats-tests.yml

This workflow runs Bats tests on pushes to the `main` branch.

### internal-run-jest-tests.yml

This workflow runs Jest tests on pushes to the `main` branch.
