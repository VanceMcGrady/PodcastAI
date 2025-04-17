import { Podcast } from '../../shared/schema';

// Generic API request function
export async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'An unknown error occurred',
    }));
    
    throw new Error(error.message || 'An unknown error occurred');
  }

  return response.json();
}

// API functions for LearncastAI
export async function transcribeAudio(audioBase64: string): Promise<string> {
  const response = await apiRequest<{ transcript: string }>('/api/transcribe', {
    method: 'POST',
    body: JSON.stringify({ audio: audioBase64 }),
  });
  
  return response.transcript;
}

export async function generatePodcast(
  topic: string,
  transcript?: string,
  onContentUpdate?: (content: string) => void
): Promise<Podcast> {
  return await apiRequest<Podcast>('/api/generate-podcast', {
    method: 'POST',
    body: JSON.stringify({
      topic,
      transcript,
      streamContent: !!onContentUpdate,
    }),
  });
}

export async function fetchPodcasts(): Promise<Podcast[]> {
  return await apiRequest<Podcast[]>('/api/podcasts');
}

export async function fetchPodcast(id: number): Promise<Podcast> {
  return await apiRequest<Podcast>(`/api/podcasts/${id}`);
}

// Utility function for formatting dates
export function getTimeAgo(date: Date | string): string {
  const now = new Date();
  const pastDate = new Date(date);
  const diff = now.getTime() - pastDate.getTime();
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days} day${days === 1 ? '' : 's'} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  } else {
    return 'Just now';
  }
}