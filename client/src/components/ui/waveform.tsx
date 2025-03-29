import { useRef, useEffect, useState } from "react";

interface WaveformProps {
  isActive: boolean;
  className?: string;
  volumeData?: Uint8Array;
  sensitivityMultiplier?: number;
}

export function Waveform({ isActive, className, volumeData, sensitivityMultiplier = 1 }: WaveformProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement[]>([]);
  const animationRef = useRef<number | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Create bars for the waveform
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
    
    return () => {
      resizeObserver.disconnect();
    };
  }, []);
  
  // Create or update bars
  useEffect(() => {
    if (!containerRef.current || containerWidth <= 0) return;
    
    const container = containerRef.current;
    
    // Clear existing bars
    container.innerHTML = '';
    barsRef.current = [];
    
    // Calculate number of bars based on container width
    const barWidth = 4;
    const barSpacing = 2;
    const totalBarWidth = barWidth + barSpacing;
    const numBars = Math.floor(containerWidth / totalBarWidth);
    
    // Create new bars
    for (let i = 0; i < numBars; i++) {
      const bar = document.createElement('div');
      bar.className = 'waveform-bar';
      bar.style.left = `${i * totalBarWidth}px`;
      bar.style.width = `${barWidth}px`;
      container.appendChild(bar);
      barsRef.current.push(bar);
    }
  }, [containerWidth]);
  
  // Handle animation based on isActive state
  useEffect(() => {
    if (!isActive) {
      // Reset bars when not active
      barsRef.current.forEach(bar => {
        bar.style.height = '5px';
      });
      
      // Cancel any ongoing animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
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
          const value = volumeData[dataIndex];
          const height = Math.max(5, value * 0.3 * sensitivityMultiplier); // Minimum 5px height
          bar.style.height = `${height}px`;
        }
      });
    } 
    // If no volume data provided, use a simulated waveform
    else if (!animationRef.current) {
      const simulateWaveform = () => {
        bars.forEach(bar => {
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
      className={`waveform-container w-full ${className || ''} ${isActive ? '' : 'hidden'}`}
    >
      <style>{`
        .waveform-container {
          height: 60px;
          position: relative;
          transition: opacity 0.3s ease-in-out;
        }
        .waveform-bar {
          position: absolute;
          bottom: 0;
          width: 4px;
          height: 5px; /* Default height */
          margin-right: 2px;
          border-radius: 2px;
          background-color: #6366F1;
          transition: height 0.1s ease-out;
        }
      `}</style>
    </div>
  );
}
