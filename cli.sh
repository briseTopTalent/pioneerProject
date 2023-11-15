#!/bin/bash
cp _cli.json tsconfig.json
tsc
cp ./dist/cli.js ./server/src/
