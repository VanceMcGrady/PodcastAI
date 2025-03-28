import { useRef, useEffect } from "react";

interface WaveformProps {
  isActive: boolean;
  className?: string;
}

export function Waveform({ isActive, className }: WaveformProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let bars: HTMLDivElement[] = [];
    
    // Create bars for the waveform
    const createBars = () => {
      // Clear existing bars
      container.innerHTML = '';
      bars = [];
      
      // Calculate number of bars based on container width
      const numBars = Math.floor(container.offsetWidth / 6);
      
      // Create new bars
      for (let i = 0; i < numBars; i++) {
        const bar = document.createElement('div');
        bar.className = 'waveform-bar';
        bar.style.left = `${i * 6}px`;
        container.appendChild(bar);
        bars.push(bar);
      }
    };
    
    // Update bar heights to create animation
    const updateWaveform = () => {
      bars.forEach(bar => {
        const height = Math.floor(Math.random() * 40) + 5;
        bar.style.height = `${height}px`;
      });
      
      if (isActive) {
        animationRef.current = requestAnimationFrame(updateWaveform);
      }
    };
    
    if (isActive) {
      createBars();
      animationRef.current = requestAnimationFrame(updateWaveform);
    } else {
      container.innerHTML = '';
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

  return (
    <div 
      ref={containerRef} 
      className={`waveform-container w-full ${className || ''} ${isActive ? '' : 'hidden'}`}
    >
      <style jsx>{`
        .waveform-container {
          height: 60px;
          position: relative;
        }
        .waveform-bar {
          position: absolute;
          bottom: 0;
          width: 4px;
          margin-right: 2px;
          border-radius: 2px;
          background-color: #6366F1;
        }
      `}</style>
    </div>
  );
}
