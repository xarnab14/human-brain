import React from 'react';
import { CognitiveFunction, ViewMode } from '../../types/neuro';
import { COGNITIVE_CIRCUITS } from '../../data/neuroData';
import { Activity, Brain, Radio, Sparkles, AlertCircle } from 'lucide-react';

interface CognitiveActivitySectionProps {
  cognitiveMode: CognitiveFunction;
  onSelectCognitiveMode: (mode: CognitiveFunction) => void;
  viewMode: ViewMode;
  onSetViewMode: (mode: ViewMode) => void;
}

export const CognitiveActivitySection: React.FC<CognitiveActivitySectionProps> = ({
  cognitiveMode,
  onSelectCognitiveMode,
  viewMode,
  onSetViewMode,
}) => {
  const modes: Array<{ id: CognitiveFunction; label: string; icon: string }> = [
    { id: 'memory', label: 'Memory Consolidation', icon: '🧠' },
    { id: 'vision', label: 'Visual Perception', icon: '👁️' },
    { id: 'hearing', label: 'Auditory Processing', icon: '👂' },
    { id: 'movement', label: 'Motor Execution', icon: '⚡' },
    { id: 'language', label: 'Language & Broca-Wernicke', icon: '💬' },
    { id: 'attention', label: 'Salience & Attention', icon: '🎯' },
    { id: 'emotion', label: 'Limbic Emotion & Valence', icon: '❤️' },
  ];

  const activeData = COGNITIVE_CIRCUITS[cognitiveMode] || COGNITIVE_CIRCUITS.memory;

  return (
    <section id="activity" className="relative py-24 px-6 md:px-12 border-t border-white/5 bg-[#05070c]">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-cyan-400">
            <span>Functional Neuroimaging</span>
            <span aria-hidden="true">·</span>
            <span>Simulated fMRI & BOLD Signal</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-display text-balance">
            Cognitive Networks & Brain Activity
          </h2>
          <p className="text-base text-slate-300 leading-relaxed text-balance">
            Simulate blood-oxygen-level-dependent (BOLD) metabolic activations across distinct human cognitive states. Watch specialized neuronal populations synchronize into large-scale functional networks.
          </p>
        </div>

        {/* Cognitive Selector Buttons */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-900/80 rounded-xl border border-white/5 overflow-x-auto max-w-full">
          {modes.map((m) => {
            const isActive = cognitiveMode === m.id && viewMode === 'cognitive';
            return (
              <button
                key={m.id}
                onClick={() => {
                  onSelectCognitiveMode(m.id);
                  if (viewMode !== 'cognitive') {
                    onSetViewMode('cognitive');
                  }
                }}
                className={`px-4 py-2.5 text-xs font-semibold tracking-wider uppercase rounded-lg transition-all whitespace-nowrap flex items-center gap-2 ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <span>{m.icon}</span>
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Circuit Deep Dive Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="text-xs uppercase font-mono text-cyan-400">Synchronized Circuit</div>
              <h3 className="text-2xl font-bold font-display text-white mt-0.5">
                {activeData.name}
              </h3>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 bg-cyan-950/60 px-3 py-1.5 rounded-lg border border-cyan-500/30">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Oscillatory Band: {activeData.frequencyBand}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-4">
              <div>
                <span className="text-xs uppercase font-mono text-slate-400 block mb-1">
                  Circuit Dynamics & Neurobiology
                </span>
                <p className="text-sm text-slate-200 leading-relaxed">{activeData.description}</p>
              </div>

              <div>
                <span className="text-xs uppercase font-mono text-slate-400 block mb-2">
                  Primary Anatomical Hubs
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeData.primaryRegions.map((region, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 text-xs text-cyan-200 bg-cyan-500/10 border border-cyan-500/30 rounded-lg font-mono"
                    >
                      {region}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs uppercase font-mono text-slate-400 block mb-1">
                  Primary Neuromodulators
                </span>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  {activeData.neurotransmitters.join(' · ')}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/60 p-5 rounded-xl border border-white/5 space-y-3">
              <div className="text-xs uppercase font-mono text-amber-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>Translational Medicine</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeData.clinicalRelevance}
              </p>

              <div className="pt-2 border-t border-white/5 text-[11px] text-slate-500">
                Educational BOLD hemodynamic simulation for scientific illustration.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
