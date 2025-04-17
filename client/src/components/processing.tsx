import { useEffect, useState } from "react";

interface ProcessingProps {
  progress: number;
  step: string;
  title?: string;
  description?: string;
  content?: string;
}

export function Processing({ progress, step, title, description, content }: ProcessingProps) {
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

  const hasContent = title && description && content;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6 flex-1 overflow-y-auto">
      <div className="flex flex-col items-center">
        {!hasContent && (
          <>
            <div className="relative mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary"></div>
              <span className="material-icons text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                auto_awesome
              </span>
            </div>
            
            <h3 className="text-lg font-medium text-center mb-2">
              Creating your learncast...
            </h3>
            
            <p className="text-gray-500 text-center">
              This might take a minute or two.
            </p>
          </>
        )}
        
        {hasContent && (
          <div className="w-full mb-6">
            <h2 className="text-xl font-bold text-center mb-2">{title}</h2>
            <p className="text-gray-600 text-center mb-8 italic">{description}</p>
            
            <div className="relative">
              <div className="absolute top-0 right-0 bg-white bg-opacity-80 px-3 py-1 rounded-lg shadow text-sm text-gray-500">
                Converting to audio...
              </div>
              <div className="prose max-w-none">
                {content?.split('\n\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        )}
        
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
        </div>
      </div>
    </div>
  );
}
