#!/usr/bin/env bats

load ./helpers.sh

function format_expected() {
  # Use jq to format the expected JSON
  echo "$1" | jq '.'
}

@test "Create JSON payload without annotation_url" {
  result=$(create_json_payload 1 2 "Test Text" "")
  expected='{"dashboardId": 1, "panelId": 2, "text": "Test Text"}'
  [ "$result" == "$(format_expected "$expected")" ]
}

@test "Create JSON payload with annotation_url" {
  result=$(create_json_payload 1 2 "Test Text" "https://example.com")
  expected='{"dashboardId": 1, "panelId": 2, "text": "<a href=\"https://example.com\" target=\"_blank\">Test Text</a>"}'
  #echo "Formatted Expected: $(format_expected "$expected")" >&3
  [ "$result" == "$(format_expected "$expected")" ]
}

@test "Create JSON payload with special characters" {
  result=$(create_json_payload 1 2 "Special \"Text\"" "")
  expected='{"dashboardId": 1, "panelId": 2, "text": "Special \"Text\""}'
  [ "$result" == "$(format_expected "$expected")" ]
}