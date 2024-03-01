#!/usr/bin/env bats

setup() {
  load test_helper
  # Load support libs
  init
  # Setup GitHub variables needed
  emulate_github_env
  # Load the function script
  load ../file-exists/file-exists.bash
}

@test "File exists" {
  # Create a temporary file for testing
  tmpfile=$(mktemp)
  echo "test" > "$tmpfile"

  # Call the function with the temporary file path and mock output and summary files
  run file_exists "$tmpfile" 

  # Assert that the function succeeds and produces expected output
  assert_success
  assert_equal "$(grep -c "exists=true" "$GITHUB_OUTPUT")" 1
  assert_equal "$(grep -c ":white_check_mark: $tmpfile exists" "$GITHUB_STEP_SUMMARY")" 1

  # Clean up temporary file
  rm "$tmpfile"
}

@test "File does not exist" {
  # Call the function with a non-existent file path and mock output and summary files
  run file_exists "/path/to/nonexistent/file" 

  # Assert that the function fails and produces expected output
  assert_failure
  assert_equal "$(grep -c "exists=false" "$GITHUB_OUTPUT")" 1
  assert_equal "$(grep -c ":x: /path/to/nonexistent/file exists" "$GITHUB_STEP_SUMMARY")" 1
}
