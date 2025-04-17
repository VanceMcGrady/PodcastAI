#!/bin/bash

# This script helps prepare and deploy the project to Vercel

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== LearncastAI Vercel Deployment Helper ===${NC}"
echo

# Check if Git is initialized
if [ ! -d ".git" ]; then
  echo -e "${YELLOW}Git repository not initialized. Initializing...${NC}"
  git init
  git add .
  git commit -m "Initial commit for Vercel deployment"
else
  echo -e "${GREEN}✓ Git repository detected${NC}"
fi

# Switch to Next.js mode
echo -e "${YELLOW}Switching to Next.js mode...${NC}"
./switch-to-nextjs.sh

# Copy environment variables
if [ ! -f ".env" ] && [ -f ".env.example" ]; then
  echo -e "${YELLOW}Creating .env file from .env.example...${NC}"
  cp .env.example .env
  echo -e "${GREEN}✓ Created .env file${NC}"
  echo -e "${YELLOW}Important: Please edit .env and add your OPENAI_API_KEY${NC}"
fi

echo
echo -e "${GREEN}=== Deployment Instructions ===${NC}"
echo -e "1. Make sure your code is pushed to GitHub"
echo -e "   git remote add origin https://github.com/yourusername/your-repo.git"
echo -e "   git push -u origin main"
echo -e "2. Go to https://vercel.com and create a new project"
echo -e "3. Connect your GitHub repository"
echo -e "4. Add your OPENAI_API_KEY as an environment variable"
echo -e "5. Deploy your project"
echo

echo -e "${GREEN}Your project is now ready for deployment to Vercel!${NC}"