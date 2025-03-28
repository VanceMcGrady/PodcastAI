import { apiRequest } from './queryClient';
import type { Podcast } from '@shared/schema';

// Function to transcribe audio
export async function transcribeAudio(audioBase64: string): Promise<string> {
  const response = await apiRequest('POST', '/api/transcribe', { audio: audioBase64 });
  const data = await response.json();
  return data.transcript;
}

// Function to generate a podcast
export async function generatePodcast(
  topic: string, 
  onProgress: (progress: number, step: string) => void
): Promise<Podcast> {
  return new Promise((resolve, reject) => {
    let podcast: Podcast | null = null;
    
    // Create a new EventSource connection
    const eventSource = new EventSource(`/api/generate-podcast?topic=${encodeURIComponent(topic)}`);
    
    // Handle progress updates
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.status === 'generating') {
        onProgress(data.progress, data.step);
      } else if (data.status === 'completed') {
        podcast = data.podcast;
        eventSource.close();
        resolve(podcast);
      } else if (data.status === 'error') {
        eventSource.close();
        reject(new Error(data.message || 'Failed to generate podcast'));
      }
    };
    
    // Handle errors
    eventSource.onerror = () => {
      eventSource.close();
      reject(new Error('Connection error while generating podcast'));
    };
  });
}

// Alternative version that uses fetch instead of EventSource
export async function generatePodcastFetch(
  topic: string,
  onProgress: (progress: number, step: string) => void
): Promise<Podcast> {
  try {
    const response = await fetch('/api/generate-podcast', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic }),
    });

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Response body is not readable');
    }

    let result = '';
    
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      // Convert the Uint8Array to a string
      const chunk = new TextDecoder().decode(value);
      result += chunk;
      
      try {
        const data = JSON.parse(chunk);
        if (data.status === 'generating') {
          onProgress(data.progress, data.step);
        } else if (data.status === 'completed') {
          return data.podcast;
        } else if (data.status === 'error') {
          throw new Error(data.message || 'Failed to generate podcast');
        }
      } catch (e) {
        // If we can't parse the JSON, it could be a partial chunk,
        // we'll try to process on the next iteration
      }
    }
    
    throw new Error('Failed to generate podcast: incomplete response');
  } catch (error) {
    console.error('Error generating podcast:', error);
    throw error;
  }
}

// Function to get all podcasts
export async function fetchPodcasts(): Promise<Podcast[]> {
  const response = await apiRequest('GET', '/api/podcasts');
  return await response.json();
}

// Function to get a specific podcast
export async function fetchPodcast(id: number): Promise<Podcast> {
  const response = await apiRequest('GET', `/api/podcasts/${id}`);
  return await response.json();
}

// Calculate time ago for displaying when a podcast was created
export function getTimeAgo(date: Date | string): string {
  const now = new Date();
  const podcastDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - podcastDate.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} days ago`;
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} months ago`;
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} years ago`;
}
