// Environment variable utility for Next.js

/**
 * Get an environment variable with fallback
 */
export function getEnv(key: string, fallback: string = ''): string {
  // For client components
  if (typeof window !== 'undefined') {
    return (process.env[`NEXT_PUBLIC_${key}`] as string) || fallback;
  }
  
  // For server components
  return (process.env[key] as string) || fallback;
}

/**
 * Get the base URL for API requests
 */
export function getApiBaseUrl(): string {
  return getEnv('API_URL', typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
}