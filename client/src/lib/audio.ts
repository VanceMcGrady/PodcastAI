// Audio recording utilities

export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStreamSource: MediaStreamAudioSourceNode | null = null;
  private volumeDataArray: Uint8Array | null = null;
  private volumeCallback: ((data: Uint8Array) => void) | null = null;
  private analyzeInterval: number | null = null;
  private maxRecordingDuration: number = 60; // Maximum recording time in seconds
  private recordingTimer: number | null = null;
  private timeRemainingCallback: ((secondsRemaining: number) => void) | null = null;

  // Check if browser supports audio recording
  public static isSupported(): boolean {
    if (typeof navigator === 'undefined') return false;
    if (!navigator.mediaDevices) return false;
    if (!navigator.mediaDevices.getUserMedia) return false;
    if (typeof window === 'undefined') return false;
    
    // Check for AudioContext support
    const hasAudioContext = !!(window.AudioContext || (window as any).webkitAudioContext);
    return hasAudioContext;
  }

  // Request microphone permission and initialize recorder
  public async initialize(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(this.stream);
      
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };
      
      // Set up audio analysis
      this.setupAudioAnalysis();
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error initializing audio recorder:", error);
      return Promise.reject(error);
    }
  }

  // Set up audio context and analyzer for volume visualization
  private setupAudioAnalysis(): void {
    if (!this.stream) return;
    
    try {
      // Use the appropriate AudioContext based on browser support
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioContextClass();
      this.analyser = this.audioContext.createAnalyser();
      this.mediaStreamSource = this.audioContext.createMediaStreamSource(this.stream);
      
      // Connect the media stream to the analyzer
      this.mediaStreamSource.connect(this.analyser);
      
      // Configure the analyzer for better visualization
      this.analyser.fftSize = 128; // Smaller value for better performance and more responsive visualization
      this.analyser.smoothingTimeConstant = 0.5; // Default is 0.8, lower values = more responsive
      this.analyser.minDecibels = -90; // Default is -100
      this.analyser.maxDecibels = -10; // Default is -30, increase to amplify quieter sounds
      
      const bufferLength = this.analyser.frequencyBinCount;
      this.volumeDataArray = new Uint8Array(bufferLength);
      
      console.log("Audio analysis setup complete - buffer length:", bufferLength);
    } catch (error) {
      console.error("Error setting up audio analysis:", error);
    }
  }

  // Set maximum recording duration (in seconds)
  public setMaxRecordingDuration(seconds: number): void {
    this.maxRecordingDuration = Math.max(10, seconds); // Minimum 10 seconds
  }
  
  // Register callback for time remaining updates
  public onTimeRemainingUpdate(callback: (secondsRemaining: number) => void): void {
    this.timeRemainingCallback = callback;
  }
  
  // Start recording with auto-stop timer
  public start(): void {
    if (!this.mediaRecorder) {
      throw new Error("Audio recorder not initialized");
    }
    
    this.audioChunks = [];
    this.mediaRecorder.start();
    
    // Start analyzing audio volume if callback is set
    this.startVolumeAnalysis();
    
    // Clear any existing timer
    if (this.recordingTimer !== null) {
      clearInterval(this.recordingTimer);
      this.recordingTimer = null;
    }
    
    // Set up countdown timer
    let secondsRemaining = this.maxRecordingDuration;
    
    // Initial callback to update UI immediately
    if (this.timeRemainingCallback) {
      this.timeRemainingCallback(secondsRemaining);
    }
    
    // Start timer that counts down and eventually stops recording
    this.recordingTimer = window.setInterval(() => {
      secondsRemaining -= 1;
      
      // Update UI with time remaining
      if (this.timeRemainingCallback) {
        this.timeRemainingCallback(secondsRemaining);
      }
      
      // Auto-stop when time runs out
      if (secondsRemaining <= 0) {
        clearInterval(this.recordingTimer as number);
        this.recordingTimer = null;
        
        // Only auto-stop if we're still recording
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
          console.log('Auto-stopping recording after reaching maximum duration');
          this.mediaRecorder.stop();
        }
      }
    }, 1000); // Update every second
  }

  // Stop recording and return audio blob
  public stop(): Promise<Blob> {
    this.stopVolumeAnalysis();
    
    // Clear the recording timer if it exists
    if (this.recordingTimer !== null) {
      clearInterval(this.recordingTimer);
      this.recordingTimer = null;
    }
    
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error("Audio recorder not initialized"));
        return;
      }
      
      // If it's not in recording state, don't try to stop it
      if (this.mediaRecorder.state !== 'recording') {
        if (this.audioChunks.length > 0) {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
          resolve(audioBlob);
        } else {
          reject(new Error("No audio recorded"));
        }
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
    });
  }

  // Register a callback to receive volume data
  public onVolumeChange(callback: (data: Uint8Array) => void): void {
    this.volumeCallback = callback;
  }

  // Start analyzing audio volume
  private startVolumeAnalysis(): void {
    if (!this.analyser || !this.volumeDataArray || !this.volumeCallback) {
      console.log("Cannot start volume analysis - missing required components");
      return;
    }
    
    // Clear any existing interval
    this.stopVolumeAnalysis();
    
    console.log("Starting volume analysis with callback");
    
    // Start a new interval to analyze volume - use requestAnimationFrame for smoother updates
    const updateVolume = () => {
      if (this.analyser && this.volumeDataArray && this.volumeCallback) {
        // Get current volume data
        this.analyser.getByteFrequencyData(this.volumeDataArray);
        
        // Send to callback
        this.volumeCallback(this.volumeDataArray);
        
        // Request next frame
        this.analyzeInterval = window.requestAnimationFrame(updateVolume);
      }
    };
    
    // Initial call to start the animation loop
    this.analyzeInterval = window.requestAnimationFrame(updateVolume);
  }

  // Stop analyzing audio volume
  private stopVolumeAnalysis(): void {
    if (this.analyzeInterval !== null) {
      // Cancel animation frame rather than clearing interval
      window.cancelAnimationFrame(this.analyzeInterval as number);
      this.analyzeInterval = null;
      console.log("Volume analysis stopped");
    }
  }

  // Get average volume level (0-100)
  public getAverageVolume(): number {
    if (!this.volumeDataArray) return 0;
    
    const values = Array.from(this.volumeDataArray);
    const average = values.reduce((sum, value) => sum + value, 0) / values.length;
    
    // Scale to 0-100
    return Math.min(100, Math.max(0, average));
  }

  // Convert blob to base64 for API submission
  public async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result?.toString();
        if (base64) {
          // Remove the data URL prefix (e.g., "data:audio/webm;base64,")
          const base64Data = base64.split(',')[1];
          resolve(base64Data);
        } else {
          reject(new Error("Failed to convert blob to base64"));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // Clean up resources
  public cleanup(): void {
    this.stopVolumeAnalysis();
    
    // Clear any recording timers
    if (this.recordingTimer !== null) {
      clearInterval(this.recordingTimer);
      this.recordingTimer = null;
    }
    
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    
    if (this.audioContext) {
      this.audioContext.close().catch(console.error);
      this.audioContext = null;
    }
    
    this.mediaStreamSource = null;
    this.analyser = null;
    this.mediaRecorder = null;
    this.volumeDataArray = null;
    this.volumeCallback = null;
    this.timeRemainingCallback = null;
  }
}

// Audio playback utilities
export class AudioPlayer {
  private audio: HTMLAudioElement;
  private intervalId: number | null = null;

  constructor(audioUrl: string) {
    this.audio = new Audio(audioUrl);
  }

  public play(): void {
    this.audio.play();
  }

  public pause(): void {
    this.audio.pause();
  }

  public stop(): void {
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  public seek(seconds: number): void {
    this.audio.currentTime = seconds;
  }

  public skipForward(seconds: number = 15): void {
    this.audio.currentTime = Math.min(this.audio.duration, this.audio.currentTime + seconds);
  }

  public skipBackward(seconds: number = 15): void {
    this.audio.currentTime = Math.max(0, this.audio.currentTime - seconds);
  }

  public getCurrentTime(): number {
    return this.audio.currentTime;
  }

  public getDuration(): number {
    return this.audio.duration;
  }

  public isPlaying(): boolean {
    return !this.audio.paused;
  }

  public onTimeUpdate(callback: (currentTime: number) => void): void {
    this.audio.addEventListener('timeupdate', () => {
      callback(this.audio.currentTime);
    });
  }

  public onEnded(callback: () => void): void {
    this.audio.addEventListener('ended', callback);
  }

  public onDurationChange(callback: (duration: number) => void): void {
    this.audio.addEventListener('durationchange', () => {
      callback(this.audio.duration);
    });
  }

  public cleanup(): void {
    this.audio.pause();
    this.audio.src = '';
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
    }
  }
}

// Format time in MM:SS format
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || !isFinite(seconds)) return "00:00";
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}
