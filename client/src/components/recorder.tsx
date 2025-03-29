import { useState, useEffect, FormEvent, useRef } from "react";
import { MicButton } from "@/components/ui/mic-button";
import { Waveform } from "@/components/ui/waveform";
import { AudioRecorder, formatTime } from "@/lib/audio";
import { transcribeAudio } from "@/lib/podcast";

interface RecorderProps {
  onRecordingComplete: (transcript: string) => void;
  onError: (error: Error) => void;
}

export function Recorder({ onRecordingComplete, onError }: RecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState<AudioRecorder | null>(null);
  const [recordingStatus, setRecordingStatus] = useState("Tap to start recording");
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [textInput, setTextInput] = useState("");
  const [showTextInput, setShowTextInput] = useState(false);
  const [volumeData, setVolumeData] = useState<Uint8Array | undefined>(undefined);
  const [microphoneAvailable, setMicrophoneAvailable] = useState<boolean | null>(null);
  const volumeSensitivity = useRef(2.0); // Higher sensitivity multiplier for more visible movement
  const maxRecordingTime = 120; // 2 minutes maximum recording time

  useEffect(() => {
    // First check if recording is supported in this browser
    if (!AudioRecorder.isSupported()) {
      console.log("Audio recording not supported in this browser");
      setMicrophoneAvailable(false);
      setShowTextInput(true); // Automatically switch to text input mode
      return;
    }

    const initRecorder = async () => {
      try {
        const newRecorder = new AudioRecorder();
        
        // Try to check microphone permissions first before full initialization
        try {
          // Just request basic permissions first
          await navigator.mediaDevices.getUserMedia({ audio: true });
          setMicrophoneAvailable(true);
        } catch (permissionError) {
          console.log("Microphone permission denied or device not available", permissionError);
          setMicrophoneAvailable(false);
          setShowTextInput(true); // Automatically switch to text input mode
          return; // Don't proceed with initialization
        }
        
        // Now proceed with full initialization
        await newRecorder.initialize();
        
        // Set up volume data callback
        newRecorder.onVolumeChange((data) => {
          setVolumeData(data);
        });
        
        setRecorder(newRecorder);
        console.log("Audio recorder initialized successfully");
      } catch (error) {
        console.error("Failed to initialize audio recorder:", error);
        setMicrophoneAvailable(false);
        setShowTextInput(true); // Automatically switch to text input mode
        
        // Only show error to user if they were actively trying to use the microphone
        if (!showTextInput) {
          onError(error instanceof Error ? error : new Error("Failed to initialize audio recorder"));
        }
      }
    };

    initRecorder();

    return () => {
      if (recorder) {
        recorder.cleanup();
      }
    };
  }, [onError]);

  useEffect(() => {
    if (recorder) {
      // Set maximum recording duration
      recorder.setMaxRecordingDuration(maxRecordingTime);
      
      // Register callback for time updates
      recorder.onTimeRemainingUpdate((seconds) => {
        setTimeRemaining(seconds);
      });
    }
  }, [recorder, maxRecordingTime]);

  const toggleRecording = async () => {
    if (!recorder) return;

    if (isRecording) {
      try {
        setRecordingStatus("Processing your recording...");
        // Reset timer display
        setTimeRemaining(null);
        
        const audioBlob = await recorder.stop();
        setIsRecording(false);
        setVolumeData(undefined); // Clear volume data when not recording
        
        // Convert to base64 for API transmission
        const audioBase64 = await recorder.blobToBase64(audioBlob);
        
        // Transcribe the audio
        const transcript = await transcribeAudio(audioBase64);
        
        // Pass the transcript back to parent component
        onRecordingComplete(transcript);
      } catch (error) {
        onError(error instanceof Error ? error : new Error("Failed to process recording"));
        setIsRecording(false);
        setVolumeData(undefined);
        setTimeRemaining(null);
        setRecordingStatus("Tap to start recording");
      }
    } else {
      try {
        // Configure and start the recorder
        recorder.start();
        setIsRecording(true);
        setRecordingStatus("Recording... Tap when finished");
      } catch (error) {
        onError(error instanceof Error ? error : new Error("Failed to start recording"));
      }
    }
  };

  const cancelRecording = () => {
    if (!recorder || !isRecording) return;
    
    recorder.stop();
    setIsRecording(false);
    setVolumeData(undefined); // Clear volume data
    setTimeRemaining(null); // Reset timer display
    setRecordingStatus("Tap to start recording");
  };

  const handleTextSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (textInput.trim()) {
      onRecordingComplete(textInput.trim());
    }
  };

  const toggleInputMethod = () => {
    // Only allow switching to microphone if it's available
    if (!showTextInput && microphoneAvailable === false) {
      return; // Don't allow switching to mic mode if microphone isn't available
    }
    setShowTextInput(!showTextInput);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6 flex-1 flex flex-col">
      <h2 className="text-lg font-semibold text-center mb-6">
        What would you like to learn about?
      </h2>
      
      <div className="flex-1 flex flex-col items-center justify-center">
        {!showTextInput ? (
          // Voice Recording UI
          <>
            <MicButton 
              isRecording={isRecording} 
              onClick={toggleRecording} 
              className="mb-6"
            />
            
            <div className="flex flex-col items-center">
              <p className="text-gray-500 text-center mb-2 h-6">
                {recordingStatus}
              </p>
              
              {/* Timer display */}
              {isRecording && timeRemaining !== null && (
                <div className="mb-3">
                  <p className="text-sm font-medium text-primary">
                    Time remaining: {formatTime(timeRemaining)}
                  </p>
                </div>
              )}
            </div>
            
            <Waveform 
              isActive={isRecording} 
              volumeData={volumeData}
              sensitivityMultiplier={volumeSensitivity.current}
              className="mb-4"
            />
            
            {isRecording ? (
              <div className="mt-6 space-x-4">
                <button 
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-200"
                  onClick={cancelRecording}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button 
                onClick={toggleInputMethod}
                className="mt-4 text-primary hover:text-secondary text-sm flex items-center"
              >
                <span className="material-icons text-sm mr-1">edit</span>
                Type instead
              </button>
            )}
          </>
        ) : (
          // Text Input UI
          <>
            {microphoneAvailable === false && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm max-w-md">
                <p className="flex items-start">
                  <span className="material-icons text-lg mr-2 mt-0.5">mic_off</span>
                  <span>Microphone access is not available. Please check your browser permissions or use the text input option.</span>
                </p>
              </div>
            )}
          
            <form onSubmit={handleTextSubmit} className="w-full max-w-md">
              <div className="mb-4">
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Describe what you'd like your podcast to be about..."
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary min-h-[120px]"
                  required
                />
              </div>
              <div className="flex justify-between">
                {microphoneAvailable !== false && (
                  <button
                    type="button"
                    onClick={toggleInputMethod}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center"
                  >
                    <span className="material-icons text-sm mr-1">mic</span>
                    Record instead
                  </button>
                )}
                <button
                  type="submit"
                  className={`px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition duration-200 ${microphoneAvailable === false ? 'ml-auto' : ''}`}
                >
                  Generate Podcast
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
