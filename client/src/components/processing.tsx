import { useEffect, useState, useRef } from "react";

interface ProcessingProps {
  progress: number;
  step: string;
  title?: string;
  description?: string;
  content?: string;
}

export function Processing({
  progress,
  step,
  title,
  description,
  content,
}: ProcessingProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const textContentRef = useRef<HTMLDivElement>(null);
  const viewportHeight = 150; // Height of the text viewing window

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

  // Slowly scroll through the content if available
  useEffect(() => {
    if (!content || !textContentRef.current) return;

    const contentHeight = textContentRef.current.scrollHeight;
    if (contentHeight <= viewportHeight) return;

    // Calculate how many pixels to scroll per second
    // We want to scroll through the entire content in about 2 minutes
    const scrollSpeed = contentHeight / 120; // pixels per second
    const scrollInterval = 50; // ms between scroll updates
    const pixelsPerUpdate = (scrollSpeed * scrollInterval) / 1000;

    const intervalId = setInterval(() => {
      setScrollPosition((prev) => {
        // Reset to beginning when we reach the end
        if (prev >= contentHeight - viewportHeight) {
          return 0;
        }
        return prev + pixelsPerUpdate;
      });
    }, scrollInterval);

    return () => clearInterval(intervalId);
  }, [content]);

  const hasContent = title && description && content;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6 flex-1">
      <div className="flex flex-col items-center">
        <div className="relative mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary" />
          <span className="material-icons text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            auto_awesome
          </span>
        </div>

        <h3 className="text-lg font-medium text-center mb-2">
          Creating your learncast...
        </h3>

        <p className="text-gray-500 text-center mb-4">
          This might take a minute or two.
        </p>

        {hasContent && (
          <div className="w-full mb-6">
            <h2 className="text-xl font-bold text-center mb-2">{title}</h2>
            <p className="text-gray-600 text-center mb-4 italic">
              {description}
            </p>

            <div className="relative mx-auto max-w-sm border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white to-transparent z-10" />

              <div className="h-[150px] overflow-hidden relative">
                <div
                  ref={textContentRef}
                  className="prose text-sm px-4 transition-transform duration-300"
                  style={{ transform: `translateY(-${scrollPosition}px)` }}
                >
                  {content?.split("\n\n").map((paragraph, idx) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    <p key={idx} className="my-2">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent z-10" />

              <div className="absolute top-2 right-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs text-gray-500 shadow-sm">
                Generating audio...
              </div>
            </div>
          </div>
        )}

        <div className="w-full max-w-xs mt-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-500">{step}</span>
            <span className="text-sm text-gray-500">{animatedProgress}%</span>
          </div>

          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${animatedProgress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
