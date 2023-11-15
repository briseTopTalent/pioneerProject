#!/bin/bash

if [[ $# -lt 3 ]]; then
	echo 'Usage: ./unsub.sh web-token locality-id sub-locality'
	exit
fi

curl -X DELETE "https://${SERVER_URL}/api/v1/users/locality/subscribe" \
	-H "Authorization: Bearer $1" \
	--data-raw '{"locality": "'$2'","sub_locality":"'$3'"}' \
	-H 'Content-type: application/json'
