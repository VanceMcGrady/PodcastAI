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
  const [currentChunkIndex, setCurrentChunkIndex] = useState<number>(0);

  const handleRecordingComplete = (newTranscript: string) => {
    setTranscript(newTranscript);
    setAppState("processing");
    
    // Start generating the podcast
    generatePodcast(newTranscript);
  };

  // Handle progression to next audio chunk when current one finishes
  const handleAudioEnded = () => {
    console.log(`Audio chunk ${currentChunkIndex} finished playing`);
    const nextChunkIndex = currentChunkIndex + 1;
    
    if (nextChunkIndex < streamingChunks.length) {
      // We have another chunk available, move to it
      console.log(`Moving to next chunk: ${nextChunkIndex} of ${streamingChunks.length}`);
      setCurrentChunkIndex(nextChunkIndex);
      setCurrentStreamingUrl(streamingChunks[nextChunkIndex]);
    } else {
      console.log("No more chunks available yet, waiting for the next chunk");
      // We'll wait for the next chunk to become available
    }
  };

  // Handle a new audio chunk becoming available
  const handleChunkReady = (chunkUrl: string, isFirstChunk: boolean, chunkIndex?: number) => {
    console.log(`New audio chunk available: ${chunkUrl}, isFirst: ${isFirstChunk}, index: ${chunkIndex}`);
    
    // Keep track of all streaming chunks
    setStreamingChunks(prev => {
      const newChunks = [...prev, chunkUrl];
      console.log(`Updated streaming chunks array, now has ${newChunks.length} chunks`);
      return newChunks;
    });
    
    // If this is the first chunk, start progressive playback
    if (isFirstChunk) {
      console.log("Starting progressive playback with first chunk");
      setIsStreamingPlayback(true);
      setCurrentStreamingUrl(chunkUrl);
      setCurrentChunkIndex(0);
      
      // Clean up any existing audio
      if (streamingAudio) {
        streamingAudio.pause();
        setStreamingAudio(null);
      }
    }
    
    // If we're at the end of current chunks and a new one arrives, let's auto-advance
    if (currentChunkIndex === streamingChunks.length - 1) {
      console.log("Current chunk is the last one, checking if we need to auto-advance");
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
              streamingStatus={isStreamingPlayback 
                ? `Listening to part ${currentChunkIndex + 1} of ${streamingChunks.length} while the rest is being created...` 
                : undefined
              }
              streamingUrl={currentStreamingUrl}
              onAudioEnded={handleAudioEnded}
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
