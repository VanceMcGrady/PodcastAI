# Deploying LearncastAI to Vercel

This document provides step-by-step instructions for deploying the LearncastAI application to Vercel.

## Prerequisites

- A GitHub account
- A Vercel account (you can sign up at https://vercel.com using your GitHub account)
- An OpenAI API key

## Deployment Steps

1. **Set up GitHub Repository**
   - Push your code to a GitHub repository
   - Make sure all your changes are committed

2. **Add Important Configuration Files**
   - Make sure you have these files in your repository:
     - `next.config.js`
     - `app/` directory with your Next.js app code
     - `vercel.json` with minimal configuration

3. **Configuration for Vercel**

   Before deploying, create a file called `.npmrc` in your repository:
   ```
   echo "legacy-peer-deps=true" > .npmrc
   ```

   And create a file called `.nvmrc` for Node.js version:
   ```
   echo "18.18.0" > .nvmrc
   ```

4. **Update package.json**

   Create a new temporary `package.json` for deployment with these scripts:
   ```json
   {
     "name": "learncast-ai",
     "version": "1.0.0",
     "private": true,
     "scripts": {
       "dev": "next dev",
       "build": "next build",
       "start": "next start",
       "lint": "next lint"
     }
   }
   ```
   
   *Note: You'll only use this file for the Vercel deployment, not in your local environment.*

5. **Deploy to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Configure the project:
     - Framework Preset: Next.js
     - Root Directory: ./
     - Build Command: next build
     - Output Directory: .next
   - Add environment variables:
     - OPENAI_API_KEY: [Your OpenAI API Key]
   - Click "Deploy"

6. **Troubleshooting**
   
   If you encounter the error about missing `routes-manifest.json`:
   
   - Make sure your `vercel.json` file only contains:
     ```json
     {
       "buildCommand": "next build",
       "outputDirectory": ".next"
     }
     ```
   
   - In the Vercel deployment settings, override the build command to:
     ```
     npm install --legacy-peer-deps && next build
     ```
   
   - Make sure your next.config.js is using the CommonJS format:
     ```js
     /** @type {import('next').NextConfig} */
     const nextConfig = {
       distDir: '.next',
       async rewrites() {
         return [
           {
             source: '/audio/:path*',
             destination: '/api/audio/:path*',
           },
         ];
       },
     };
     
     module.exports = nextConfig;
     ```

## After Deployment

Once deployed, your application will be available at:
- `https://your-project-name.vercel.app`

You can set up a custom domain in the Vercel dashboard if needed.

## Updating Your Deployment

Any new pushes to the main branch of your GitHub repository will automatically trigger a new deployment on Vercel.