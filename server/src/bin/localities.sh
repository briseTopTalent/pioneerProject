#!/bin/bash

curl -X GET "https://${SERVER_URL}/api/v1/localities/recursive" \
  -H 'Authorization: Bearer 37368ac9527911cc44bc3cc5fb2aab93069ce20e4596607ba81dfe10c3375f79' \
	-H 'Content-type: application/json'
