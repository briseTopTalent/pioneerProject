#!/bin/bash

if [[ $# -lt 2 ]]; then
	echo 'Usage: ./login.sh email password'
	exit
fi

curl -X POST "https://${SERVER_URL}/api/v1/auth/login" \
	--data-raw '{"email":"'"$1"'","password":"'"$2"'"}' \
	-H 'Content-type: application/json'
