# LearncastAI

LearncastAI is a web application that generates personalized educational audio content using intelligent voice input and advanced audio processing technologies, enabling users to create dynamic learning experiences with enhanced content generation capabilities.

## Features

- Voice and text input for creating educational audio content
- Real-time text streaming during content generation
- Enhanced audio recording capabilities with automatic time limits
- Advanced content generation using OpenAI's GPT-4o model
- Professional audio narration using Nova voice
- Chunking of long content for proper handling with OpenAI's TTS limits
- Responsive design for mobile and desktop devices

## Technology Stack

- React with TypeScript for the frontend
- Express.js for the backend API
- OpenAI API for content generation and speech synthesis
- Web Speech API for audio recording and recognition
- Tailwind CSS and shadcn/ui for styling
- Vite for development and build tooling

## Deploying to Vercel

This application is set up for deployment on Vercel. Follow these steps to deploy:

1. Sign up for a Vercel account at [vercel.com](https://vercel.com)
2. Install the Vercel CLI: `npm i -g vercel`
3. Run `vercel login` and follow the prompts to log in
4. Run `vercel` in the project root directory to deploy
5. When prompted, add your OPENAI_API_KEY as an environment variable

### Environment Variables

Make sure to set the following environment variables in your Vercel project settings:

- `OPENAI_API_KEY`: Your OpenAI API key for content generation and speech synthesis

### Storage Considerations

The current implementation uses in-memory storage, which means data will be lost when the serverless functions restart. For a production deployment, consider implementing one of these options:

1. Use Vercel KV (Redis) for persistent storage
2. Use a database like Postgres with Neon or similar serverless database
3. Implement AWS S3 or similar storage service for audio files

## Local Development

To run the application locally:

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up environment variables in a `.env` file:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```
4. Start the development server with `npm run dev`
5. Open your browser to the URL shown in the console

## License

This project is licensed under the MIT License - see the LICENSE file for details.
