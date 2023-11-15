#!/bin/bash

if [[ $# -lt 2 ]]; then
	echo 'Usage: ./get-incident-details.sh web-token incident-id'
	exit 1
fi

curl -X GET "https://${SERVER_URL}/api/v1/incidents/details/$2" \
  -H "Authorization: Bearer $1"
