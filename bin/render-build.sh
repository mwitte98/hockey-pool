#!/usr/bin/env bash
# exit on error
set -o errexit

bundle install
bundle exec rake assets:precompile
bundle exec rake assets:clean
bin/rails db:migrate

cd client
npm install --legacy-peer-deps
npm run build-prod
