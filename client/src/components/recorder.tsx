import { useState, useEffect, FormEvent, useRef } from "react";
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
  const [textInput, setTextInput] = useState("");
  const [showTextInput, setShowTextInput] = useState(false);
  const [volumeData, setVolumeData] = useState<Uint8Array | undefined>(undefined);
  const volumeSensitivity = useRef(1.2); // Adjustable sensitivity for better visualization

  useEffect(() => {
    if (!AudioRecorder.isSupported()) {
      onError(new Error("Audio recording is not supported in this browser"));
      return;
    }

    const initRecorder = async () => {
      try {
        const newRecorder = new AudioRecorder();
        await newRecorder.initialize();
        
        // Set up volume data callback
        newRecorder.onVolumeChange((data) => {
          setVolumeData(data);
        });
        
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
    setVolumeData(undefined); // Clear volume data
    setRecordingStatus("Tap to start recording");
  };

  const handleTextSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (textInput.trim()) {
      onRecordingComplete(textInput.trim());
    }
  };

  const toggleInputMethod = () => {
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
            
            <p className="text-gray-500 text-center mb-4 h-6">
              {recordingStatus}
            </p>
            
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
                <button
                  type="button"
                  onClick={toggleInputMethod}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center"
                >
                  <span className="material-icons text-sm mr-1">mic</span>
                  Record instead
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition duration-200"
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
