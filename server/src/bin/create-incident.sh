#!/bin/bash

if [[ $# -lt 5 ]]; then
	echo 'Usage: ./create-incident.sh web-token locality-id sub-locality-id latitude longitude'
	exit
fi

curl -X POST "https://${SERVER_URL}/api/v1/incidents" \
	-H "Authorization: Bearer $1" \
	--data-raw '{"field1_value":"1","field2_value":"1","field3_value":"1","field4_value":"1","field5_value":"1","address":"address","responding_units":["1"],"featured":true,"locality": "'$2'","sub_locality":"'$3'","latitude":"'$4'","longitude":"'$5'"}' \
	-H 'Content-type: application/json'
