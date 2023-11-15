#!/bin/bash

WEBTOKEN=$(echo "$WEBTOKEN" | sed -E 's|[^a-z0-9_]+||gi' | tr -d '[:space:]')
curl -X GET "https://${SERVER_URL}/api/v1/notifications" \
  -H "Authorization: Bearer $WEBTOKEN" \
	-H 'Content-type: application/json'
