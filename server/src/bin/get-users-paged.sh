#!/bin/bash

if [[ $# -lt 2 ]]; then
	echo "Usage: $0 page limit"
	exit 1
fi

PAGE=$(echo -n "$1" | sed -e 's|[^0-9]+||gi')
LIMIT=$(echo -n "$2" | sed -e 's|[^0-9]+||gi')

curl -X GET "https://${SERVER_URL}/api/v1/users?page=$PAGE&limit=$LIMIT" \
  -H "Authorization: Bearer $WEBTOKEN" \
	-H 'Content-type: application/json'
