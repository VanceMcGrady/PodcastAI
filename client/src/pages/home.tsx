import { useState, useEffect, useRef } from "react";
import { Recorder } from "@/components/recorder";
import { Processing } from "@/components/processing";
import { PodcastPlayer } from "@/components/podcast-player";
import { ErrorView } from "@/components/error-view";
import { RecentPodcasts } from "@/components/recent-podcasts";
import { generatePodcastFetch } from "@/lib/podcast";
import { AudioPlayer } from "@/lib/audio";
import type { Podcast } from "@shared/schema";

type AppState = "recording" | "processing" | "player" | "error";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("recording");
  const [error, setError] = useState<Error | null>(null);
  const [transcript, setTranscript] = useState<string>("");
  const [podcast, setPodcast] = useState<Podcast | null>(null);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState("Initializing...");
  const [refreshRecent, setRefreshRecent] = useState(false);
  
  // Progressive streaming state
  const [streamingChunks, setStreamingChunks] = useState<string[]>([]);
  const [isStreamingPlayback, setIsStreamingPlayback] = useState(false);
  const [streamingAudio, setStreamingAudio] = useState<HTMLAudioElement | null>(null);
  const [currentStreamingUrl, setCurrentStreamingUrl] = useState<string | undefined>();

  const handleRecordingComplete = (newTranscript: string) => {
    setTranscript(newTranscript);
    setAppState("processing");
    
    // Start generating the podcast
    generatePodcast(newTranscript);
  };

  // Handle a new audio chunk becoming available
  const handleChunkReady = (chunkUrl: string, isFirstChunk: boolean) => {
    setStreamingChunks(prev => [...prev, chunkUrl]);
    
    // If this is the first chunk and we're not already playing, start playback
    if (isFirstChunk && !isStreamingPlayback) {
      setIsStreamingPlayback(true);
      setCurrentStreamingUrl(chunkUrl);
      
      // Create an audio element for the chunk if not already playing
      if (!streamingAudio) {
        const audioEl = new Audio(chunkUrl);
        setStreamingAudio(audioEl);
        audioEl.play().catch(err => console.error("Error playing first chunk:", err));
      }
    }
  };
  
  // Generate podcast with progressive streaming
  const generatePodcast = async (topic: string) => {
    try {
      // Reset states
      setProgress(0);
      setStep("Analyzing topic...");
      setStreamingChunks([]);
      setIsStreamingPlayback(false);
      setCurrentStreamingUrl(undefined);
      if (streamingAudio) {
        streamingAudio.pause();
        setStreamingAudio(null);
      }
      
      const newPodcast = await generatePodcastFetch(
        topic,
        (newProgress, newStep) => {
          setProgress(newProgress);
          setStep(newStep);
        },
        handleChunkReady // Pass the chunk handler
      );
      
      // Clean up audio player when complete
      if (streamingAudio) {
        streamingAudio.pause();
        setStreamingAudio(null);
      }
      
      setPodcast(newPodcast);
      setAppState("player");
      setRefreshRecent(prev => !prev); // Toggle to refresh the recent podcasts list
    } catch (err) {
      // Clean up audio player on error
      if (streamingAudio) {
        streamingAudio.pause();
        setStreamingAudio(null);
      }
      
      setError(err instanceof Error ? err : new Error("Failed to generate podcast"));
      setAppState("error");
    }
  };

  const handleError = (err: Error) => {
    setError(err);
    setAppState("error");
  };

  const handleRetry = () => {
    setError(null);
    setAppState("recording");
  };

  const handleCreateNew = () => {
    setAppState("recording");
  };

  const handleSelectPodcast = (selectedPodcast: Podcast) => {
    setPodcast(selectedPodcast);
    setAppState("player");
  };

  return (
    <div className="max-w-md mx-auto p-4 min-h-screen flex flex-col">
      <header className="py-4 flex items-center justify-between">
        <div className="flex items-center">
          <span className="material-icons text-primary text-3xl mr-2">school</span>
          <h1 className="text-xl font-bold text-gray-800">Learncast AI</h1>
        </div>
        <button className="text-gray-500 hover:text-gray-700" aria-label="Settings">
          <span className="material-icons">settings</span>
        </button>
      </header>

      <main className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col">
          {appState === "recording" && (
            <Recorder
              onRecordingComplete={handleRecordingComplete}
              onError={handleError}
            />
          )}
          
          {appState === "processing" && (
            <Processing 
              progress={progress} 
              step={step} 
              isStreamingAvailable={isStreamingPlayback}
              streamingStatus={isStreamingPlayback ? "Listening to the beginning while the rest is being created..." : undefined}
            />
          )}
          
          {appState === "player" && podcast && (
            <PodcastPlayer podcast={podcast} onCreateNew={handleCreateNew} />
          )}
          
          {appState === "error" && error && (
            <ErrorView error={error} onRetry={handleRetry} />
          )}
        </div>

        <RecentPodcasts 
          onSelectPodcast={handleSelectPodcast}
          currentPodcastId={podcast?.id}
          refresh={refreshRecent}
        />
      </main>

      <footer className="py-4 text-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} Learncast AI • All content is AI-generated</p>
      </footer>
    </div>
  );
}
