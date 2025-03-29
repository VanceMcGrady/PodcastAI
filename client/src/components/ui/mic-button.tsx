import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface MicButtonProps {
  isRecording: boolean;
  onClick: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function MicButton({
  isRecording,
  onClick,
  size = "lg",
  className,
}: MicButtonProps) {
  const sizeClasses = {
    sm: "w-12 h-12 text-2xl",
    md: "w-16 h-16 text-3xl",
    lg: "w-24 h-24 text-5xl",
  };

  return (
    <button
      type="button"
      className={cn(
        "bg-primary rounded-full flex items-center justify-center shadow-lg hover:bg-secondary transition duration-200 focus:outline-none focus:ring-4 focus:ring-primary focus:ring-opacity-50",
        isRecording && "recording-pulse",
        sizeClasses[size],
        className
      )}
      onClick={onClick}
      aria-label={isRecording ? "Stop recording" : "Start recording"}
    >
      <span className="material-icons text-white">{isRecording ? "stop" : "mic"}</span>
      
      <style>{`
        .recording-pulse {
          box-shadow: 0 0 0 rgba(99, 102, 241, 0.4);
          animation: recording-pulse 2s infinite;
        }
        @keyframes recording-pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4);
          }
          70% {
            box-shadow: 0 0 0 20px rgba(99, 102, 241, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
          }
        }
      `}</style>
    </button>
  );
}
