import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/5 bg-[#030509] py-16 px-6 md:px-12 text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="space-y-2">
          <span className="text-xl font-bold font-display text-white tracking-tight">
            NEURO
          </span>
          <p className="text-xs text-slate-400 max-w-sm">
            An interactive exploration of the human brain. Uniting 3D medical visualization, connectomics, and cellular neuroscience.
          </p>
        </div>

        <nav className="flex flex-wrap items-center gap-6 text-xs font-mono uppercase tracking-wider text-slate-400">
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
            Connectome
          </a>
          <a href="#synapse" className="hover:text-cyan-400 transition-colors">
            Synapse
          </a>
          <a href="#activity" className="hover:text-cyan-400 transition-colors">
            Cognition
          </a>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
        <div>
          Educational visualization. Not intended for medical diagnosis.
        </div>
        <div>
          Designed for high-performance WebGL & modern display standards.
        </div>
      </div>
    </footer>
  );
};
