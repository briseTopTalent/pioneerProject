#!/bin/bash

if [[ $# -lt 1 ]]; then
	echo "Usage: $0 incident-id"
	exit 1
fi

curl -X GET "https://${SERVER_URL}/api/v1/localities/$1/responding-units" \
  -H "Authorization: Bearer ${WEB_TOKEN}"
