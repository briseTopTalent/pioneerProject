#!/bin/bash

if [[ $# -lt 2 ]]; then
	echo 'Usage: ./get-likes.sh web-token incident-id'
	exit
fi

curl -X GET "https://${SERVER_URL}/api/v1/incidents/likes/$2" \
	-H "Authorization: Bearer $1" \
	-H 'Content-type: application/json'
