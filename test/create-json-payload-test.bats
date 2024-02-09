#!/usr/bin/env bats

setup() {
  load test_helper
  # Load support libs
  init
  # Load the function script
  load ../create-grafana-annotation/create-json-payload.bash
}

function format_expected() {
  # Use jq to format the expected JSON
  echo "$1" | jq '.'
}

@test "Create JSON payload without annotation_url" {
  result=$(create_json_payload 1 2 "Test Text" "")
  expected='{"dashboardId": 1, "panelId": 2, "text": "Test Text"}'
  assert_equal "$(format_expected "$result")" "$(format_expected "$expected")"
}

@test "Create JSON payload with annotation_url" {
  result=$(create_json_payload 1 2 "Test Text" "https://example.com")
  expected='{"dashboardId": 1, "panelId": 2, "text": "<a href=\"https://example.com\">Test Text</a>"}'
  assert_equal "$(format_expected "$result")" "$(format_expected "$expected")"
}

@test "Create JSON payload with special characters" {
  result=$(create_json_payload 1 2 "Special \"Text\"" "")
  expected='{"dashboardId": 1, "panelId": 2, "text": "Special \"Text\""}'
  assert_equal "$(format_expected "$result")" "$(format_expected "$expected")"
}