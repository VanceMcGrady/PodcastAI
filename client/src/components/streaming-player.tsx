import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface StreamingPlayerProps {
  audioUrl: string;
  isPlaying: boolean;
  onPlayPause: () => void;
}

export function StreamingPlayer({ audioUrl, isPlaying, onPlayPause }: StreamingPlayerProps) {
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      
      // Set up progress update
      audioRef.current.addEventListener('timeupdate', () => {
        if (audioRef.current) {
          const currentTime = audioRef.current.currentTime;
          const duration = audioRef.current.duration || 1;
          setProgress((currentTime / duration) * 100);
        }
      });
    }
    
    return () => {
      // Clean up when component unmounts
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioUrl]);
  
  // Update play/pause state when isPlaying prop changes
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.play().catch(err => console.error("Error playing audio:", err));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);
  
  return (
    <div className="w-full bg-blue-50 border border-blue-100 rounded-lg p-3 mt-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="flex-shrink-0 flex items-center justify-center bg-blue-100 rounded-full w-8 h-8 mr-3">
            <span className="material-icons text-blue-500 text-sm">
              {isPlaying ? "pause" : "play_arrow"}
            </span>
          </div>
          <div className="flex-1">
            <div className="text-sm text-blue-700 font-medium">
              Listening to introduction...
            </div>
            <div className="mt-1 text-xs text-blue-500">
              The full audiobook will be available when processing is complete.
            </div>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 rounded-full text-blue-500 hover:text-blue-700 hover:bg-blue-100"
          onClick={onPlayPause}
        >
          <span className="material-icons">
            {isPlaying ? "pause" : "play_arrow"}
          </span>
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="w-full bg-blue-100 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-blue-500 h-1.5 rounded-full transition-all duration-300 ease-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="material-icons text-blue-500 text-lg">volume_up</span>
      </div>
    </div>
  );
}