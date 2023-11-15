#!/bin/bash

if [[ $# -lt 3 ]]; then
	echo 'Usage: ./update-incident.sh web-token incident-id field1_value'
	exit
fi

curl -X PATCH "https://${SERVER_URL}/api/v1/incidents/$2" \
	-H "Authorization: Bearer $1" \
	--data-raw '{"field1_value":"'"$3"'","field2_value":"1","field3_value":"1","field4_value":"1","field5_value":"1","address":"address","responding_units":["1"],"featured":true,"locality": "1","sub_locality":"2","latitude":"1","longitude":"1"}' \
	-H 'Content-type: application/json'
