#!/bin/bash

curl -X GET "https://${SERVER_URL}/api/v1/users/profile" \
  -H 'Authorization: Bearer dc02d46c446e7671b582da7cff6df34a7570ed25ebdad1497a3816b94cf1e6fe' \
	-H 'Content-type: application/json'
