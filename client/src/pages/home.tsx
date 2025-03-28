import { useState, useEffect } from "react";
import { Recorder } from "@/components/recorder";
import { Processing } from "@/components/processing";
import { PodcastPlayer } from "@/components/podcast-player";
import { ErrorView } from "@/components/error-view";
import { RecentPodcasts } from "@/components/recent-podcasts";
import { generatePodcastFetch } from "@/lib/podcast";
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

  const handleRecordingComplete = (newTranscript: string) => {
    setTranscript(newTranscript);
    setAppState("processing");
    
    // Start generating the podcast
    generatePodcast(newTranscript);
  };

  const generatePodcast = async (topic: string) => {
    try {
      setProgress(0);
      setStep("Analyzing topic...");
      
      const newPodcast = await generatePodcastFetch(
        topic,
        (newProgress, newStep) => {
          setProgress(newProgress);
          setStep(newStep);
        }
      );
      
      setPodcast(newPodcast);
      setAppState("player");
      setRefreshRecent(prev => !prev); // Toggle to refresh the recent podcasts list
    } catch (err) {
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
          <span className="material-icons text-primary text-3xl mr-2">podcasts</span>
          <h1 className="text-xl font-bold text-gray-800">PodcastAI</h1>
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
            <Processing progress={progress} step={step} />
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
        <p>© {new Date().getFullYear()} PodcastAI • All content is AI-generated</p>
      </footer>
    </div>
  );
}
