import { AudioPlayer } from "@/components/ui/audio-player";
import type { Podcast } from "@shared/schema";

interface PodcastPlayerProps {
  podcast: Podcast;
  onCreateNew: () => void;
}

export function PodcastPlayer({ podcast, onCreateNew }: PodcastPlayerProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6 flex-1 flex flex-col">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{podcast.title}</h2>
        <p className="text-gray-600 text-sm">{podcast.description}</p>
      </div>
      
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex justify-center mb-8">
          <div className="w-40 h-40 bg-gradient-to-br from-primary to-accent rounded-lg shadow-md flex items-center justify-center">
            <span className="material-icons text-white text-5xl">podcasts</span>
          </div>
        </div>
        
        <AudioPlayer audioUrl={podcast.audioUrl} />
      </div>
      
      <div className="mt-6 flex justify-center">
        <button 
          className="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition duration-200"
          onClick={onCreateNew}
        >
          Create new podcast
        </button>
      </div>
    </div>
  );
}
