#!/bin/bash

if [[ $# -lt 2 ]]; then
	echo 'Usage: ./get-for-locality.sh web-token locality-id locality-id-2 locality-id-3 ... and so on ...'
	exit 1
fi

WEBTOKEN="$1"
shift

IDS=
for id in $*; do
  IDS="$IDS,$id"
done

IDS=$(echo "$IDS" | sed -E 's|^,||')

curl -X GET "https://${SERVER_URL}/api/v1/incidents/locality" \
  -H "Authorization: Bearer $WEBTOKEN" \
	--data-raw '{"localities": ['$IDS']}' \
	-H 'Content-type: application/json'
