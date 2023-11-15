#!/bin/bash

if [[ $# -lt 1 ]]; then
	echo 'Usage: ./forgot-pw.sh email'
	exit
fi

curl -X POST "https://${SERVER_URL}/api/v1/auth/forgot-password" \
	--data-raw '{"email": "'"$1"'"}' \
	-H 'Content-type: application/json'
