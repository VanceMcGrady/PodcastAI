# Deploying LearncastAI to Vercel

This document provides instructions for deploying the LearncastAI application to Vercel.

## Prerequisites

1. A GitHub repository containing your LearncastAI codebase
2. A Vercel account (you can sign up at [vercel.com](https://vercel.com))
3. An OpenAI API key

## Preparation Steps

1. Make sure your code is pushed to a GitHub repository
2. Switch to Next.js mode by running:
   ```bash
   chmod +x switch-to-nextjs.sh
   ./switch-to-nextjs.sh
   ```
3. Commit the changes to your repository

## Deployment Process

1. **Connect your GitHub repository to Vercel**:
   - Log in to your Vercel account
   - Click "Add New" > "Project"
   - Select your GitHub repository
   - Click "Import"

2. **Configure project settings**:
   - In the "Configure Project" screen, expand the "Environment Variables" section
   - Add the following environment variable:
     - Name: `OPENAI_API_KEY`
     - Value: Your OpenAI API key
   - The framework preset should automatically be set to Next.js

3. **Deploy your project**:
   - Click "Deploy"
   - Vercel will build and deploy your application

4. **Access your deployed application**:
   - Once the deployment is complete, Vercel will provide you with a URL for your application
   - Click on the URL to access your deployed LearncastAI application

## Post-Deployment

- You can configure a custom domain for your application in the Vercel dashboard
- Verify that all features are working properly in the deployed application

## Troubleshooting

If you encounter issues with your deployment:

1. Check the build logs in the Vercel dashboard for any errors
2. Verify that your environment variables are correctly set
3. Ensure that your OpenAI API key is valid and has sufficient credits

## Switching Back to Express Mode for Local Development

If you need to switch back to Express mode for local development:

```bash
chmod +x switch-to-express.sh
./switch-to-express.sh
```

This will restore the original configuration files.