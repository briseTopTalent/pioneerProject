#!/bin/bash

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <pkid>"
  exit 1
fi
WEBTOKEN=$(echo "$WEBTOKEN" | sed -E 's|[^a-z0-9_]+||gi' | tr -d '[:space:]')
ID=$(echo -n "$1" | sed -E 's|[^a-z0-9_]+||gi' | tr -d '[:space:]')
curl -X DELETE "https://${SERVER_URL}/api/v1/notifications/$ID" \
  -H "Authorization: Bearer $WEBTOKEN" \
	-H 'Content-type: application/json'
