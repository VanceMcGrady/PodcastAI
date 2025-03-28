import { useState, useEffect, useRef } from "react";
import { formatTime } from "@/lib/audio";

interface AudioPlayerProps {
  audioUrl: string;
  onEnded?: () => void;
}

export function AudioPlayer({ audioUrl, onEnded }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleDurationChange = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (onEnded) onEnded();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.pause();
      audio.src = '';
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioUrl, onEnded]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };

  const skipForward = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.min(audioRef.current.duration || 0, audioRef.current.currentTime + 15);
  };

  const skipBackward = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 15);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !audioRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const position = (e.clientX - rect.left) / rect.width;
    const newTime = position * (audioRef.current.duration || 0);
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  return (
    <div className="w-full">
      <div 
        className="audio-progress mb-4 cursor-pointer" 
        ref={progressRef}
        onClick={handleProgressClick}
      >
        <div 
          className="audio-progress-bar" 
          style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
        ></div>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500">{formatTime(currentTime)}</span>
        <span className="text-sm text-gray-500">{formatTime(duration)}</span>
      </div>
      
      <div className="flex items-center justify-center space-x-8">
        <button 
          className="text-gray-700 hover:text-primary" 
          aria-label="Skip backward 15 seconds"
          onClick={skipBackward}
        >
          <span className="material-icons text-3xl">replay_15</span>
        </button>
        <button 
          className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white shadow-md hover:bg-secondary transition duration-200 focus:outline-none focus:ring-4 focus:ring-primary focus:ring-opacity-50"
          onClick={togglePlayPause}
        >
          <span className="material-icons text-3xl">
            {isPlaying ? 'pause' : 'play_arrow'}
          </span>
        </button>
        <button 
          className="text-gray-700 hover:text-primary" 
          aria-label="Skip forward 15 seconds"
          onClick={skipForward}
        >
          <span className="material-icons text-3xl">forward_15</span>
        </button>
      </div>

      <style jsx>{`
        .audio-progress {
          cursor: pointer;
          height: 8px;
          border-radius: 4px;
          overflow: hidden;
          background-color: #E5E7EB;
        }
        .audio-progress-bar {
          height: 100%;
          background-color: #6366F1;
          transition: width 0.1s linear;
        }
      `}</style>
    </div>
  );
}
