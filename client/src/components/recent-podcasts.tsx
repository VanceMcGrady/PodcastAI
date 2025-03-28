import { useEffect, useState } from "react";
import { fetchPodcasts, getTimeAgo } from "@/lib/podcast";
import { formatTime } from "@/lib/audio";
import type { Podcast } from "@shared/schema";

interface RecentPodcastsProps {
  onSelectPodcast: (podcast: Podcast) => void;
  currentPodcastId?: number;
  refresh?: boolean;
}

export function RecentPodcasts({ onSelectPodcast, currentPodcastId, refresh }: RecentPodcastsProps) {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadPodcasts = async () => {
      try {
        setIsLoading(true);
        const data = await fetchPodcasts();
        setPodcasts(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load podcasts"));
      } finally {
        setIsLoading(false);
      }
    };

    loadPodcasts();
  }, [refresh]);

  if (isLoading) {
    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Your Recent Podcasts</h3>
        <div className="animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="bg-gray-200 h-20 rounded-lg mb-3"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Your Recent Podcasts</h3>
        <div className="bg-red-50 p-4 rounded-lg text-red-500 text-center">
          {error.message}
        </div>
      </div>
    );
  }

  if (podcasts.length === 0) {
    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Your Recent Podcasts</h3>
        <div className="bg-gray-50 p-4 rounded-lg text-gray-500 text-center">
          You haven't created any podcasts yet.
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">Your Recent Podcasts</h3>
      
      {podcasts.map((podcast) => (
        <div 
          key={podcast.id}
          className={`bg-white rounded-lg shadow-sm p-4 mb-3 flex items-center hover:bg-gray-50 cursor-pointer ${podcast.id === currentPodcastId ? 'ring-2 ring-primary' : ''}`}
          onClick={() => onSelectPodcast(podcast)}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded flex items-center justify-center mr-4">
            <span className="material-icons text-white text-sm">podcasts</span>
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 mb-1">{podcast.title}</h4>
            <div className="flex items-center text-sm text-gray-500">
              <span className="material-icons text-xs mr-1">schedule</span>
              <span>{formatTime(podcast.duration)}</span>
              <span className="mx-2">•</span>
              <span>{getTimeAgo(podcast.createdAt)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
