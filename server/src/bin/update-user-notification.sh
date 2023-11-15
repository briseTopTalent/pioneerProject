#!/bin/bash

if [[ $# -lt 3 ]]; then
  echo "Usage: $0 <pkid> <type> <id>"
  exit 1
fi
WEBTOKEN=$(echo "$WEBTOKEN" | sed -E 's|[^a-z0-9_]+||gi' | tr -d '[:space:]')
PKID=$(echo -n "$1" | sed -E 's|[^a-z0-9_]+||gi' | tr -d '[:space:]')
TYPE=$(echo -n "$2" | sed -E 's|[^a-z0-9_]+||gi' | tr -d '[:space:]')
ID=$(echo -n "$3" | sed -E 's|[^a-z0-9_]+||gi' | tr -d '[:space:]')
curl -X PATCH "https://${SERVER_URL}/api/v1/notifications/$PKID" \
  -H "Authorization: Bearer $WEBTOKEN" \
	--data-raw "{\"notification_type\":\"$TYPE\",\"notification_id\":\"$ID\"}" \
	-H 'Content-type: application/json'
