import { useState, useEffect } from "react";
import { MicButton } from "@/components/ui/mic-button";
import { Waveform } from "@/components/ui/waveform";
import { AudioRecorder } from "@/lib/audio";
import { transcribeAudio } from "@/lib/podcast";

interface RecorderProps {
  onRecordingComplete: (transcript: string) => void;
  onError: (error: Error) => void;
}

export function Recorder({ onRecordingComplete, onError }: RecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState<AudioRecorder | null>(null);
  const [recordingStatus, setRecordingStatus] = useState("Tap to start recording");

  useEffect(() => {
    if (!AudioRecorder.isSupported()) {
      onError(new Error("Audio recording is not supported in this browser"));
      return;
    }

    const initRecorder = async () => {
      try {
        const newRecorder = new AudioRecorder();
        await newRecorder.initialize();
        setRecorder(newRecorder);
      } catch (error) {
        onError(error instanceof Error ? error : new Error("Failed to initialize audio recorder"));
      }
    };

    initRecorder();

    return () => {
      if (recorder) {
        recorder.cleanup();
      }
    };
  }, [onError]);

  const toggleRecording = async () => {
    if (!recorder) return;

    if (isRecording) {
      try {
        setRecordingStatus("Processing your recording...");
        const audioBlob = await recorder.stop();
        setIsRecording(false);
        
        // Convert to base64 for API transmission
        const audioBase64 = await recorder.blobToBase64(audioBlob);
        
        // Transcribe the audio
        const transcript = await transcribeAudio(audioBase64);
        
        // Pass the transcript back to parent component
        onRecordingComplete(transcript);
      } catch (error) {
        onError(error instanceof Error ? error : new Error("Failed to process recording"));
        setIsRecording(false);
        setRecordingStatus("Tap to start recording");
      }
    } else {
      try {
        recorder.start();
        setIsRecording(true);
        setRecordingStatus("Recording... Tap to stop");
      } catch (error) {
        onError(error instanceof Error ? error : new Error("Failed to start recording"));
      }
    }
  };

  const cancelRecording = () => {
    if (!recorder || !isRecording) return;
    
    recorder.stop();
    setIsRecording(false);
    setRecordingStatus("Tap to start recording");
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6 flex-1 flex flex-col">
      <h2 className="text-lg font-semibold text-center mb-6">
        What would you like to learn about?
      </h2>
      
      <div className="flex-1 flex flex-col items-center justify-center">
        <MicButton 
          isRecording={isRecording} 
          onClick={toggleRecording} 
          className="mb-6"
        />
        
        <p className="text-gray-500 text-center mb-4 h-6">
          {recordingStatus}
        </p>
        
        <Waveform 
          isActive={isRecording} 
          className="mb-4"
        />
        
        {isRecording && (
          <div className="mt-6 space-x-4">
            <button 
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-200"
              onClick={cancelRecording}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
