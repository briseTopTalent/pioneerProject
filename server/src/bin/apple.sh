#!/bin/bash

#if [[ $# -lt 3 ]]; then
#	echo 'Usage: ./comment.sh web-token incident-id comment'
#  echo 'note, this script kinda sucks and only allows one long word as a comment'
#	exit
#fi

TOKEN=$(cat ./token | tr -d '[:space:]')

curl -X POST "https://${SERVER_URL}/api/v1/auth/apple/verify" \
	--data-raw '{"token": "'$TOKEN'"}' \
	-H 'Content-type: application/json'
