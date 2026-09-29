import React, { useState, useEffect } from 'react';
import { Eye, Layers, Compass, Zap, Volume2, VolumeX, Sparkles, Activity } from 'lucide-react';

interface NavbarProps {
  onEnter3DMode: () => void;
  is3DFullscreen: boolean;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
  audioActive: boolean;
  onToggleAudio: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onEnter3DMode,
  is3DFullscreen,
  reducedMotion,
  onToggleReducedMotion,
  audioActive,
  onToggleAudio,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled
          ? 'bg-[#05070c]/85 backdrop-blur-xl border-white/10 shadow-2xl py-3.5 px-6'
          : 'bg-transparent border-transparent py-5 px-6 md:px-12'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Zone 1: Brand Wordmark (Single text element in display font) */}
        <a
          href="#"
          className="text-xl md:text-2xl font-bold tracking-tight text-white hover:text-cyan-400 transition-colors font-display"
        >
          NEURO
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs tracking-wider uppercase font-medium text-slate-300">
          <a href="#explore" className="hover:text-cyan-400 transition-colors">
            Explore
          </a>
          <a href="#lobes" className="hover:text-cyan-400 transition-colors">
            Lobes
          </a>
          <a href="#anatomy" className="hover:text-cyan-400 transition-colors">
            Anatomy
          </a>
          <a href="#connectome" className="hover:text-cyan-400 transition-colors">
            Pathways
          </a>
          <a href="#synapse" className="hover:text-cyan-400 transition-colors">
            Synapse
          </a>
          <a href="#cross-section" className="hover:text-cyan-400 transition-colors">
            Cross-Section
          </a>
          <a href="#activity" className="hover:text-cyan-400 transition-colors">
            Cognition
          </a>
        </nav>

        {/* Zone 3: Primary Action & Controls */}
        <div className="flex items-center gap-3">
          {/* Audio Synthesizer Ambience Toggle */}
          <button
            onClick={onToggleAudio}
            title={audioActive ? 'Mute neural pulse sound' : 'Enable neural frequency sound'}
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-white/5 rounded-lg border border-white/5 transition-colors"
          >
            {audioActive ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Reduced Motion Toggle */}
          <button
            onClick={onToggleReducedMotion}
            title={reducedMotion ? 'Enable 3D motion animations' : 'Reduce motion'}
            className={`px-2.5 py-1.5 text-xs font-mono rounded-lg border transition-colors ${
              reducedMotion
                ? 'border-cyan-500/40 text-cyan-300 bg-cyan-950/30'
                : 'border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {reducedMotion ? 'Static' : 'Motion'}
          </button>

          {/* 3D Experience Action Button */}
          <button
            onClick={onEnter3DMode}
            className="px-4 py-2 text-xs font-semibold tracking-wider uppercase text-cyan-200 bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 rounded-lg shadow-[0_0_15px_-3px_rgba(6,182,212,0.3)] transition-all whitespace-nowrap active:scale-95"
          >
            {is3DFullscreen ? 'Exit 3D View' : '3D Experience'}
          </button>
        </div>
      </div>
    </header>
  );
};
