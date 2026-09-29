import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onLoaded: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoaded }) => {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFading(true);
            setTimeout(onLoaded, 600);
          }, 300);
          return 100;
        }
        const inc = Math.floor(Math.random() * 15) + 8;
        return Math.min(100, prev + inc);
      });
    }, 80);

    return () => clearInterval(interval);
  }, [onLoaded]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#05070c] transition-opacity duration-700 ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background ambient radial glow */}
      <div className="absolute w-[450px] h-[450px] rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center space-y-6 text-center px-6">
        {/* Logo */}
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight font-display text-white">
          NEURO
        </h1>

        <div className="text-xs font-mono uppercase tracking-widest text-cyan-400">
          Initializing neural visualization...
        </div>

        {/* Progress Bar */}
        <div className="w-56 sm:w-72 h-1 bg-slate-900 rounded-full overflow-hidden border border-white/10 relative">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-sky-400 transition-all duration-150 ease-out shadow-[0_0_12px_#06b6d4]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Percentage */}
        <div className="text-xs font-mono text-slate-400 tabular-nums">
          {progress}%
        </div>
      </div>
    </div>
  );
};
