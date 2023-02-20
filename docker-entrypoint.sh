#!/usr/bin/env sh
set -eu

envsubst '${API_SERVER}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/nginx.conf

exec "$@"