#!/bin/bash

if [[ $# -lt 2 ]]; then
  echo "Usage: $0 <type> <id>"
  exit 1
fi
WEBTOKEN=$(echo "$WEBTOKEN" | sed -E 's|[^a-z0-9_]+||gi' | tr -d '[:space:]')
TYPE=$(echo -n "$1" | sed -E 's|[^a-z0-9_]+||gi' | tr -d '[:space:]')
ID=$(echo -n "$2" | sed -E 's|[^a-z0-9_]+||gi' | tr -d '[:space:]')
curl -X POST "https://${SERVER_URL}/api/v1/notifications" \
  -H "Authorization: Bearer $WEBTOKEN" \
	--data-raw "{\"notification_type\":\"$TYPE\",\"notification_id\":\"$ID\"}" \
	-H 'Content-type: application/json'
