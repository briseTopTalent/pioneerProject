#!/bin/bash

if [[ $# -lt 2 ]]; then
	echo 'Usage: ./like-incident.sh web-token incident-id'
	exit
fi

curl -X POST "https://${SERVER_URL}/api/v1/incidents/dislikes" \
	-H "Authorization: Bearer $1" \
	--data-raw '{"incidentID":"'$2'"}' \
	-H 'Content-type: application/json'
