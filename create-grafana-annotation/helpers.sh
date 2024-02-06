#!/bin/env bash

create_json_payload() {
  local dashboard_id=$1
  local panel_id=$2
  local annotation_text=$3
  local annotation_url=$4

  if [ -n "$annotation_url" ]; then
    annotation_text="<a href=\"$annotation_url\" target=\"_blank\">$annotation_text</a>"
  fi

  jq -n \
    --arg dashboard_id "$dashboard_id" \
    --arg panel_id "$panel_id" \
    --arg text "$annotation_text" \
    '{"dashboardId": $dashboard_id | tonumber, "panelId": $panel_id | tonumber, "text": $text}'
}