import React from 'react';
import { Activity, Sliders, Zap, Eye, Share2 } from 'lucide-react';
import { ViewMode } from '../../types/neuro';

interface NeuralConnectomeSectionProps {
  viewMode: ViewMode;
  onSetViewMode: (mode: ViewMode) => void;
  neuralActivity: number;
  onNeuralActivityChange: (val: number) => void;
}

export const NeuralConnectomeSection: React.FC<NeuralConnectomeSectionProps> = ({
  viewMode,
  onSetViewMode,
  neuralActivity,
  onNeuralActivityChange,
}) => {
  const isConnectomeActive = viewMode === 'connectome';

  return (
    <section id="connectome" className="relative py-24 px-6 md:px-12 border-t border-white/5 bg-[#05070c]/80">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text & Interactive Control Panel */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-cyan-400">
              <span>Diffusion Tensor Imaging</span>
              <span aria-hidden="true">·</span>
              <span>Macro-Connectomics</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-display text-balance">
              The Neural Connectome & Fiber Pathways
            </h2>

            <p className="text-base text-slate-300 leading-relaxed text-balance">
              Transition the cerebral cortex into a translucent optical lattice to reveal thousands of fine white-matter axonal fascicles. Watch bioelectrical action potentials travel continuously across commissural, association, and projection tracts.
            </p>

            {/* Mode Switch & Neural Activity Slider Panel */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-xs uppercase font-mono text-cyan-400">Visualization Mode</div>
                  <div className="text-sm font-semibold text-white">Neural Pathway Translucency</div>
                </div>

                <button
                  onClick={() => onSetViewMode(isConnectomeActive ? 'anatomical' : 'connectome')}
                  className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase rounded-lg border transition-all flex items-center gap-2 ${
                    isConnectomeActive
                      ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                      : 'bg-slate-900 border-white/10 text-slate-300 hover:text-white hover:border-cyan-500/40'
                  }`}
                >
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>{isConnectomeActive ? 'Exit Connectome Mode' : 'Enable Connectome Mode'}</span>
                </button>
              </div>

              {/* Neural Activity Controller */}
              <div className="space-y-3 pt-4 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                    <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span className="uppercase">Neural Activity Frequency</span>
                  </div>
                  <span className="text-xs font-mono text-cyan-400 font-bold tabular-nums">
                    {neuralActivity}% ({(neuralActivity * 0.8).toFixed(1)} Hz Firing)
                  </span>
                </div>

                <input
                  type="range"
                  min="5"
                  max="100"
                  value={neuralActivity}
                  onChange={(e) => onNeuralActivityChange(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />

                <div className="flex justify-between text-[11px] font-mono text-slate-500">
                  <span>Delta (0.5–4 Hz)</span>
                  <span>Alpha (8–12 Hz)</span>
                  <span>Gamma (&gt;30 Hz Peak)</span>
                </div>
              </div>
            </div>

            {/* Tract Anatomy Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5">
                <div className="text-xs font-mono text-cyan-400 mb-1">Commissural Tracts</div>
                <div className="text-sm font-semibold text-white">Corpus Callosum</div>
                <p className="text-xs text-slate-400 mt-1">200M+ myelinated axons bridging left and right hemispheres.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5">
                <div className="text-xs font-mono text-cyan-400 mb-1">Projection Tracts</div>
                <div className="text-sm font-semibold text-white">Corticospinal Tract</div>
                <p className="text-xs text-slate-400 mt-1">Direct descending motor control conduits from cortex to spinal cord.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5">
                <div className="text-xs font-mono text-cyan-400 mb-1">Association Tracts</div>
                <div className="text-sm font-semibold text-white">Arcuate Fasciculus</div>
                <p className="text-xs text-slate-400 mt-1">Intrahemispheric language network linking Wernicke and Broca territories.</p>
              </div>
            </div>
          </div>

          {/* Right Column: High-Fidelity DTI Tractography Scientific Asset */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 glass-panel shadow-2xl group">
              <img
                src="/src/assets/images/neural_connectome_macro_1790597522881.jpg"
                alt="High-resolution Diffusion Tensor Imaging tractography of the human connectome"
                referrerPolicy="no-referrer"
                className="w-full h-80 sm:h-96 object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />
              
              <div className="absolute bottom-4 left-4 right-4 z-10 space-y-1">
                <div className="text-[11px] font-mono uppercase text-cyan-400">Diffusion MRI Tractography</div>
                <div className="text-sm font-bold text-white">Whole-Brain Human Connectome (DTI)</div>
                <p className="text-xs text-slate-300">
                  Color-coded by spatial orientation: Red (left-right), Green (anterior-posterior), Blue (superior-inferior).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
