#!/usr/bin/env bash
# exit on error
set -o errexit

bundle install
# bin/rails db:migrate

cd client
npm install --legacy-peer-deps
npm run build-prod
