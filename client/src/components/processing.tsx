import { useEffect, useState } from "react";

interface ProcessingProps {
  progress: number;
  step: string;
  isStreamingAvailable?: boolean;
  streamingStatus?: string;
}

export function Processing({ 
  progress, 
  step, 
  isStreamingAvailable = false,
  streamingStatus
}: ProcessingProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  
  // Smoothly animate the progress
  useEffect(() => {
    // Start at current animated progress
    let currentProgress = animatedProgress;
    
    // Animate towards target progress
    const intervalId = setInterval(() => {
      if (currentProgress < progress) {
        currentProgress = Math.min(progress, currentProgress + 1);
        setAnimatedProgress(currentProgress);
      } else {
        clearInterval(intervalId);
      }
    }, 30);
    
    return () => clearInterval(intervalId);
  }, [progress, animatedProgress]);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6 flex-1">
      <div className="flex flex-col items-center justify-center h-full">
        <div className="relative mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary"></div>
          <span className="material-icons text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            auto_awesome
          </span>
        </div>
        
        <h3 className="text-lg font-medium text-center mb-2">
          Creating your Learncast...
        </h3>
        
        <p className="text-gray-500 text-center mb-2">
          This takes a few minutes. We're creating a high-quality 20-minute educational audiobook.
        </p>
        <p className="text-xs text-gray-400 text-center mb-1">
          The process involves multiple steps: planning content structure, writing chapters,
        </p>
        <p className="text-xs text-gray-400 text-center mb-2">
          generating professional narration, and assembling the final audiobook.
        </p>
        
        <div className="w-full max-w-xs mt-8">
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-500">
              {step}
            </span>
            <span className="text-sm text-gray-500">
              {animatedProgress}%
            </span>
          </div>
          
          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300 ease-out" 
              style={{ width: `${animatedProgress}%` }}
            ></div>
          </div>
          
          {isStreamingAvailable && streamingStatus && (
            <div className="mt-6 p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center justify-center bg-blue-100 rounded-full w-8 h-8 mr-3">
                  <span className="material-icons text-blue-500 text-sm">headphones</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-blue-700 font-medium">
                    {streamingStatus}
                  </div>
                  <div className="mt-1 text-xs text-blue-500">
                    The full audiobook will be available when processing is complete.
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="w-full max-w-[85%] bg-blue-100 h-1 rounded-full overflow-hidden">
                  <div className="bg-blue-400 h-1 w-1/3 rounded-full animate-pulse"></div>
                </div>
                <span className="material-icons text-blue-500 text-lg ml-2">volume_up</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
