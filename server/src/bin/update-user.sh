#!/bin/bash

if [[ $# -lt 4 ]]; then
  echo "Usage: $0 <firstName> <lastName> <phone> <password>"
  exit 1
fi
WEBTOKEN=$(echo "$WEBTOKEN" | sed -E 's|[^a-z0-9_]+||gi' | tr -d '[:space:]')
FIRST_NAME=$(echo -n "$1" | sed -E 's|[^a-z0-9_]+||gi' | tr -d '[:space:]')
LAST_NAME=$(echo -n "$2" | sed -E 's|[^a-z0-9_]+||gi' | tr -d '[:space:]')
PHONE=$(echo -n "$3" | sed -E 's|[^0-9 ()-]+||gi' | tr -d '[:space:]')
PASSWORD="$4"
curl -X PATCH "https://${SERVER_URL}/api/v1/users" \
  -H "Authorization: Bearer $WEBTOKEN" \
	--data-raw "{\"firstName\":\"$FIRST_NAME\",\"lastName\":\"$LAST_NAME\",\"phoneNumber\":\"$PHONE\",\"password\":\"$PASSWORD\"}" \
	-H 'Content-type: application/json'
