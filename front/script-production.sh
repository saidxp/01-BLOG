#!/bin/bash

cd "$(dirname "$0")"

npx ng build --configuration development
node dist/front/server/server.mjs