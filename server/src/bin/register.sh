#!/bin/bash

if [[ $# -lt 2 ]]; then
	echo 'Usage: ./register.sh email password'
	exit
fi

curl -X POST "https://${SERVER_URL}/api/v1/auth/register" \
	--data-raw '{"firstName": "test first","lastName": "test last","email":"'$1'","phoneNumber":"123-444-5678","title":"test_title","password":"'$2'"}' \
	-H 'Content-type: application/json'
