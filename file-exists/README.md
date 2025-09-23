# GitHub Action: Check if File Exists

## Description

This GitHub Action checks if a specified file exists within the repository. It provides an output indicating whether the file exists or not.

## Author

### Digdir Platform Team

## Usage

```yaml
name: Check if File Exists
on: [push]

jobs:
  check-file-exists:
    runs-on: ubuntu-latest
    steps:
      - name: "Check if file exists"
        id: file-exists
        uses: digdir/github-actions/file-exists@v1
        with:
          file-path: "path/to/your/file.txt"
      - name: "Display file existence status"
        run: |
          echo "File exists: ${{ steps.file-exists.outputs.exists }}"
```

## How it Works

This action uses a composite run to execute a Bash script that checks the existence of the specified file within the repository.

### Inputs

- `file-path`: The path to the file to be checked for existence. (Required)

### Outputs

- `exists`: Indicates whether the file exists or not. Possible values are "true" or "false".

### Example

```yaml
- name: Check if file exists
  id: check-if-file-exists
  uses: digdir/github-actions/file-exists@v1
  with:
    file-path: "path/to/your/file.txt"
```

This action can be used in various workflows to ensure the presence of specific files before proceeding with subsequent steps.
