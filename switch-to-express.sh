#!/bin/bash
# This script switches the project back to use Express configuration

# Restore original .replit file
cp .replit.original .replit
cp tsconfig.original.json tsconfig.json

echo "Switched back to Express mode. You can now run 'npm run dev' to start the Express server."