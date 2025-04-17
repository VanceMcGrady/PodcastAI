#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== LearncastAI Build Verification ===${NC}"
echo

# Check Node.js version
echo -e "${YELLOW}Checking Node.js version...${NC}"
NODE_VERSION=$(node -v)
echo -e "Node.js version: ${NODE_VERSION}"

# Check if working in Next.js mode
if [ ! -f "package.json" ]; then
  echo -e "${RED}Error: package.json not found${NC}"
  exit 1
fi

if ! grep -q "\"next\":" package.json; then
  echo -e "${RED}Error: Next.js not found in package.json. Run ./switch-to-nextjs.sh first.${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Next.js configuration detected${NC}"

# Check for required files
echo -e "${YELLOW}Checking required files...${NC}"
REQUIRED_FILES=("next.config.js" "app/layout.tsx" "app/page.tsx" "tsconfig.json")
MISSING_FILES=0

for FILE in "${REQUIRED_FILES[@]}"
do
  if [ ! -f "$FILE" ]; then
    echo -e "${RED}Missing required file: $FILE${NC}"
    MISSING_FILES=$((MISSING_FILES+1))
  fi
done

if [ $MISSING_FILES -eq 0 ]; then
  echo -e "${GREEN}✓ All required files are present${NC}"
else
  echo -e "${RED}Error: $MISSING_FILES required files are missing${NC}"
  exit 1
fi

# Clean up previous build
if [ -d ".next" ]; then
  echo -e "${YELLOW}Cleaning previous build...${NC}"
  rm -rf .next
fi

# Run a test build
echo -e "${YELLOW}Running test build...${NC}"
npm run build

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ Build completed successfully${NC}"
  
  # Check for routes-manifest.json
  if [ -f ".next/routes-manifest.json" ]; then
    echo -e "${GREEN}✓ routes-manifest.json is present${NC}"
  else
    echo -e "${RED}Error: routes-manifest.json not found. Build may not be valid for Vercel.${NC}"
    exit 1
  fi
  
  echo
  echo -e "${GREEN}=== Build Verification Complete ===${NC}"
  echo -e "${GREEN}Your project should now deploy correctly to Vercel.${NC}"
  echo -e "${YELLOW}Remember to set the OPENAI_API_KEY environment variable in Vercel.${NC}"
else
  echo -e "${RED}Error: Build failed${NC}"
  exit 1
fi