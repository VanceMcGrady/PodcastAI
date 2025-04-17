'use client';

import dynamic from 'next/dynamic';

// Dynamically import the Home component to avoid SSR issues with browser-only APIs
const Home = dynamic(() => import('../client/src/pages/home'), { ssr: false });

export default function HomePage() {
  return <Home />;
}