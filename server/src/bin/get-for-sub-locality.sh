#!/bin/bash

if [[ $# -lt 2 ]]; then
	echo 'Usage: ./get-for-sub-locality.sh web-token sub-locality-id sub-locality-id-2 sub-locality-id-3 ... and so on ...'
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
	--data-raw '{"sub_localities": ['$IDS']}' \
	-H 'Content-type: application/json'
