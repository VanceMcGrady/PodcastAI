#!/bin/bash
# This script switches the project to use Next.js configuration

# Copy config files
cp .replit.nextjs .replit
cp tsconfig.next.json tsconfig.json

echo "Switched to Next.js mode. You can now run 'npm run dev' to start the Next.js development server."
echo "To deploy to Vercel, connect your GitHub repository to Vercel and configure environment variables."