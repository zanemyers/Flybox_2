#!/usr/bin/env bash
set -eux  # Exit on error, print commands, treat unset variables as errors

# Move to app root
SCRIPT_DIR=$(dirname "$0")
cd "$SCRIPT_DIR/.."

# Run migrations using the config file
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Start the server
node server/server.js