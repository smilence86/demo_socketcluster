#!/bin/bash

#usage: ./run.sh 2

# set -x
set -euvo pipefail
# IFS=$'\n\t'

tsc

cp -r public/ ./dist/
cp -r config.test/ ./dist/

pushd ./dist/
echo $'\n-------------------------  server started    ---------------------------\n'
node server.js -w ${1:-w}
popd
