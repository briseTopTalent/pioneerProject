#!/bin/bash

if [[ $# -lt 2 ]]; then
	echo 'Usage: ./get-setup.sh web-token incident-id incdent-id-2 ... and so on ... '
	exit 1
fi

WEBTOKEN=$1
shift

IDS=""
for id in $*; do
	IDS="${IDS},$id"
done
IDS=$(echo $IDS | sed -E 's|^,||')

curl -X GET "https://${SERVER_URL}/api/v1/localities/setup" \
  -H "Authorization: Bearer $WEBTOKEN" \
	-H 'Content-type: application/json' \
	--data-raw '{"ids": ['$IDS']}'
