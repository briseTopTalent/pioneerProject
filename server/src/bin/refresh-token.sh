#!/bin/bash

if [[ $# -lt 2 ]]; then
	echo 'Usage: ./create-incident.sh web-token refresh-token'
	exit
fi

curl -X POST "https://${SERVER_URL}/api/v1/auth/refresh" \
	-H "Authorization: Bearer $1" \
	--data-raw '{"token":"'"$2"'"}' \
	-H 'Content-type: application/json'
