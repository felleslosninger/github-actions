#!/bin/env bash

# Check if a file exists and write the result to $GITHUB_OUTPUT and $GITHUB_STEP_SUMMARY
# Usage: file_exists <file_path>
file_exists() {
  local file_path=$1

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
