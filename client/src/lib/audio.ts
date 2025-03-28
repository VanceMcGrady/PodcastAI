// Audio recording utilities

export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;

  // Check if browser supports audio recording
  public static isSupported(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
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
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error initializing audio recorder:", error);
      return Promise.reject(error);
    }
  }

  // Start recording
  public start(): void {
    if (!this.mediaRecorder) {
      throw new Error("Audio recorder not initialized");
    }
    
    this.audioChunks = [];
    this.mediaRecorder.start();
  }

  // Stop recording and return audio blob
  public stop(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error("Audio recorder not initialized"));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
    });
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
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.mediaRecorder = null;
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
