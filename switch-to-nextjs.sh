#!/bin/bash
# This script switches the project to use Next.js configuration

# Show starting message
echo "Switching to Next.js mode..."

# Copy config files
cp .replit.nextjs .replit
cp tsconfig.next.json tsconfig.json
cp package.json.nextjs package.json

# Create a .nvmrc file for Vercel
echo "18.18.0" > .nvmrc

# Create a .npmrc file for handling peer dependencies gracefully
echo "legacy-peer-deps=true" > .npmrc

echo "✅ Switched to Next.js mode successfully."
echo ""
echo "To run locally: npm run dev"
echo "To deploy to Vercel:"
echo "1. Push your code to GitHub"
echo "2. Connect your repository to Vercel"
echo "3. Add OPENAI_API_KEY as an environment variable on Vercel"
echo "4. Deploy your project"
echo ""
echo "The deployment should now work correctly. If you encounter issues,"
echo "check the Vercel deploy logs for detailed error information."