import React from 'react';
import { ArrowDown, Compass, Eye, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onExploreClick: () => void;
  onEnter3DMode: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreClick,
  onEnter3DMode,
}) => {
  return (
    <section id="explore" className="relative min-h-screen flex items-center pt-24 pb-16 px-6 md:px-12 pointer-events-none">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Cinematic Typography & CTAs */}
        <div className="lg:col-span-6 space-y-6 pointer-events-auto">
          {/* Unboxed Metadata Label */}
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 tracking-widest uppercase">
            <span>Interactive Neuroscience Experience</span>
            <span aria-hidden="true">·</span>
            <span>86B Neurons</span>
            <span aria-hidden="true">·</span>
            <span>100T Synapses</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-white font-display leading-[1.08] text-balance">
            THE HUMAN <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">BRAIN</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed max-w-xl text-balance">
            Explore the most complex biological network in the known universe. Inspect 3D anatomical structures, trace connectome fiber pathways, and dive into synaptic neurotransmission in real time.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onExploreClick}
              className="px-6 py-3.5 text-xs font-semibold tracking-wider uppercase text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all hover:scale-[1.02] active:scale-98 whitespace-nowrap flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Explore The Brain</span>
            </button>

            <button
              onClick={onEnter3DMode}
              className="px-6 py-3.5 text-xs font-semibold tracking-wider uppercase text-cyan-200 bg-slate-900/80 hover:bg-slate-800 border border-cyan-500/30 rounded-lg hover:border-cyan-400/60 transition-all hover:scale-[1.02] active:scale-98 whitespace-nowrap flex items-center gap-2"
            >
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>Enter 3D Mode</span>
            </button>
          </div>

          {/* Real Scientific Telemetry */}
          <div className="pt-8 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">86B</div>
              <div className="text-xs text-slate-400">Total Neurons</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400 tabular-nums">100T</div>
              <div className="text-xs text-slate-400">Synaptic Links</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">120 m/s</div>
              <div className="text-xs text-slate-400">Axon Conduction</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400 tabular-nums">20%</div>
              <div className="text-xs text-slate-400">Metabolic Energy</div>
            </div>
          </div>
        </div>

        {/* Right column is reserved for the 3D Brain canvas interaction */}
        <div className="hidden lg:block lg:col-span-6 pointer-events-none">
          {/* Subtle guide hint */}
          <div className="flex justify-end pr-4">
            <span className="text-[11px] font-mono tracking-widest uppercase text-slate-500 bg-slate-950/40 backdrop-blur-md px-3 py-1.5 rounded border border-white/5">
              Drag to Orbit · Scroll to Zoom · Click Structure
            </span>
          </div>
        </div>
      </div>

      {/* Subtle Scroll Down Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-auto">
        <a
          href="#lobes"
          className="text-xs font-mono uppercase tracking-widest text-slate-400 hover:text-cyan-400 transition-colors flex flex-col items-center gap-1.5"
        >
          <span>Scroll to Discover</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce text-cyan-400" />
        </a>
      </div>
    </section>
  );
};
