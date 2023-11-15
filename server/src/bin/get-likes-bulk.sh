#!/bin/bash

if [[ $# -lt 2 ]]; then
	echo 'Usage: ./get-likes.sh web-token CSV-incident-id'
	exit
fi

curl -X POST "https://${SERVER_URL}/api/v1/incidents/likes/bulk" \
	-H "Authorization: Bearer $1" \
	--data-raw '{"ids":['$2']}' \
	-H 'Content-type: application/json'
