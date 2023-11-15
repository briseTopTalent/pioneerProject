#!/bin/bash

if [[ $# -lt 3 ]]; then
	echo 'Usage: ./comment.sh web-token incident-id comment'
  echo 'note, this script kinda sucks and only allows one long word as a comment'
	exit
fi

curl -X POST "https://${SERVER_URL}/api/v1/incidents/comment" \
	-H "Authorization: Bearer $1" \
	--data-raw '{"incidentID": "'$2'","comment":"'$3'"}' \
	-H 'Content-type: application/json'
