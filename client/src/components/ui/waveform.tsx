import { useRef, useEffect, useState } from "react";

interface WaveformProps {
  isActive: boolean;
  className?: string;
  volumeData?: Uint8Array;
  sensitivityMultiplier?: number;
}

export function Waveform({
  isActive,
  className,
  volumeData,
  sensitivityMultiplier = 1,
}: WaveformProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement[]>([]);
  const animationRef = useRef<number | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Debug visible state
  useEffect(() => {
    console.log("Waveform component - isActive:", isActive);
    console.log(
      "Waveform component - volumeData:",
      volumeData ? "present" : "not present"
    );
  }, [isActive, volumeData]);

  // Create bars for the waveform - ensure we have a visible container
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const updateContainerSize = () => {
      if (container) {
        setContainerWidth(container.offsetWidth);
      }
    };

    // Initial size
    updateContainerSize();

    // Update on resize
    const resizeObserver = new ResizeObserver(updateContainerSize);
    resizeObserver.observe(container);

    // Force a second update after a brief delay (helps with initial rendering)
    const timer = setTimeout(() => {
      updateContainerSize();
      setForceUpdate((prev) => prev + 1);
    }, 100);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(timer);
    };
  }, []);

  // Create or update bars when container size changes or we force an update
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!containerRef.current || containerWidth <= 0) return;

    const container = containerRef.current;

    // Clear existing bars
    container.innerHTML = "";
    barsRef.current = [];

    // Calculate number of bars based on container width
    const barWidth = 3;
    const barSpacing = 3;
    const totalBarWidth = barWidth + barSpacing;
    const numBars = Math.max(20, Math.floor(containerWidth / totalBarWidth));

    // Create new bars
    for (let i = 0; i < numBars; i++) {
      const bar = document.createElement("div");
      bar.className = "waveform-bar";
      bar.style.left = `${i * totalBarWidth}px`;
      bar.style.width = `${barWidth}px`;
      container.appendChild(bar);
      barsRef.current.push(bar);
    }

    // Initial state - small bars
    // biome-ignore lint/complexity/noForEach: <explanation>
    barsRef.current.forEach((bar) => {
      bar.style.height = "5px";
    });
  }, [containerWidth, forceUpdate]);

  // Handle animation based on isActive state - also show/hide container
  useEffect(() => {
    // When inactive, reset bars and stop animation
    if (!isActive) {
      // biome-ignore lint/complexity/noForEach: <explanation>
      barsRef.current.forEach((bar) => {
        bar.style.height = "5px";
      });

      // Cancel any ongoing animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }

      // If container exists, make it less visible
      if (containerRef.current) {
        containerRef.current.style.opacity = "0.5";
      }
    } else {
      // If container exists, make it fully visible
      if (containerRef.current) {
        containerRef.current.style.opacity = "1";
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isActive]);

  // Update waveform with volume data if provided
  useEffect(() => {
    if (!isActive || !barsRef.current.length) return;

    const bars = barsRef.current;

    // If we have real volume data, use it
    if (volumeData && volumeData.length > 0) {
      // Cancel any existing animation frame
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }

      // Map frequency data to bars
      const stepSize = Math.ceil(volumeData.length / bars.length) || 1;

      bars.forEach((bar, index) => {
        // Get data point from volume data
        const dataIndex = index * stepSize;
        if (dataIndex < volumeData.length) {
          // Scale the value (0-255) to a reasonable bar height
          // Increase multiplier for more visible movement
          const value = volumeData[dataIndex];
          // Make bars taller for better visibility and apply sensitivity multiplier
          const height = Math.max(
            5,
            Math.min(60, value * 0.5 * sensitivityMultiplier)
          );
          bar.style.height = `${height}px`;
        }
      });
    }
    // If no volume data provided, use a simulated waveform
    else if (!animationRef.current) {
      const simulateWaveform = () => {
        // biome-ignore lint/complexity/noForEach: <explanation>
        bars.forEach((bar) => {
          const height = Math.floor(Math.random() * 40) + 5;
          bar.style.height = `${height}px`;
        });

        if (isActive) {
          animationRef.current = requestAnimationFrame(simulateWaveform);
        }
      };

      animationRef.current = requestAnimationFrame(simulateWaveform);
    }
  }, [isActive, volumeData, sensitivityMultiplier]);

  return (
    <div
      ref={containerRef}
      className={`waveform-container w-full ${className || ""}`}
    >
      <style>{`
        .waveform-container {
          height: 60px;
          position: relative;
          transition: opacity 0.3s ease-in-out;
          opacity: 0.5;
          min-height: 60px;
        }
        .waveform-bar {
          position: absolute;
          bottom: 0;
          width: 3px;
          height: 5px; /* Default height */
          margin-right: 3px;
          border-radius: 2px;
          background-color: #6366F1;
          transition: height 0.05s ease-out;
        }
      `}</style>
    </div>
  );
}
