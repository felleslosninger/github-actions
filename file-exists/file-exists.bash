#!/bin/env bash

# Check if a file exists and write the result to an output file and summary file
# Usage: file_exists <file_path> [<output_file>] [<summary_file>]
file_exists() {
  local file_path=$1
  local output_file=${2:-$}
  local summary_file=${3:-$GITHUB_STEP_SUMMARY}

  if [ -f "$file_path" ]; then
    echo "exists=true" >> "$GITHUB_OUTPUT"
    echo "- :white_check_mark: $file_path exists" >> "$GITHUB_STEP_SUMMARY"
  else 
    echo "exists=false" >> "$GITHUB_OUTPUT"
    echo "- :x: $file_path exists" >> "$GITHUB_STEP_SUMMARY"
    echo "::error title=File not found::$file_path" >> "$GITHUB_OUTPUT"
    return 1
  fi
}
