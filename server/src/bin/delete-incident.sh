#!/bin/bash

if [[ $# -lt 2 ]]; then
	echo 'Usage: ./update-incident.sh web-token incident-id'
	exit
fi

curl -X DELETE "https://${SERVER_URL}/api/v1/incidents/$2" \
	-H "Authorization: Bearer $1" \
	-H 'Content-type: application/json'
