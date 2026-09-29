import React from 'react';
import { ViewMode, BrainStructureId } from '../../types/neuro';
import { Scissors, Sliders, Eye, Target } from 'lucide-react';

interface CrossSectionSectionProps {
  viewMode: ViewMode;
  onSetViewMode: (mode: ViewMode) => void;
  crossSectionAxis: 'sagittal' | 'coronal' | 'axial';
  onSetCrossSectionAxis: (axis: 'sagittal' | 'coronal' | 'axial') => void;
  crossSectionDepth: number;
  onSetCrossSectionDepth: (depth: number) => void;
  onSelectStructure: (id: BrainStructureId) => void;
}

export const CrossSectionSection: React.FC<CrossSectionSectionProps> = ({
  viewMode,
  onSetViewMode,
  crossSectionAxis,
  onSetCrossSectionAxis,
  crossSectionDepth,
  onSetCrossSectionDepth,
  onSelectStructure,
}) => {
  const isSectionActive = viewMode === 'cross-section';

  const visibleInternalStructures = [
    {
      id: 'corpus-callosum' as BrainStructureId,
      name: 'Corpus Callosum',
      latin: 'Corpus callosum',
      type: 'White Matter Arch',
      desc: 'The great cerebral commissure connecting homotopic cortical areas between the left and right hemispheres.',
    },
    {
      id: 'thalamus' as BrainStructureId,
      name: 'Thalamus',
      latin: 'Thalamus dorsalis',
      type: 'Sensory Relay Hub',
      desc: 'Paired ovoid nuclear masses gating all ascending sensory signals (visual, auditory, somatic) before cortical delivery.',
    },
    {
      id: 'hippocampus' as BrainStructureId,
      name: 'Hippocampus',
      latin: 'Cornu Ammonis',
      type: 'Limbic Consolidation',
      desc: 'Trilaminar archicortex in the medial temporal horn orchestrating long-term episodic memory and spatial navigation.',
    },
    {
      id: 'hypothalamus' as BrainStructureId,
      name: 'Hypothalamus',
      latin: 'Hypothalamus',
      type: 'Homeostatic Core',
      desc: 'Ventral diencephalic regulator of body temperature, circadian rhythms, hunger, thirst, and neuroendocrine signaling.',
    },
    {
      id: 'brainstem' as BrainStructureId,
      name: 'Brainstem Core',
      latin: 'Truncus encephali',
      type: 'Vital Conduit',
      desc: 'Midbrain, pons, and medulla oblongata harboring vital autonomic nuclei for cardiorespiratory regulation.',
    },
    {
      id: 'ventricles' as BrainStructureId,
      name: 'Ventricular System',
      latin: 'Systema ventriculare',
      type: 'CSF Hydrodynamics',
      desc: 'C-shaped lateral and third ventricles producing 500 mL of buoyant cerebrospinal fluid daily via the choroid plexus.',
    },
  ];

  return (
    <section id="cross-section" className="relative py-24 px-6 md:px-12 border-t border-white/5 bg-[#05070c]/90">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-cyan-400">
            <span>Anatomical Cutaway</span>
            <span aria-hidden="true">·</span>
            <span>Real-Time Volumetric Clipping</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-display text-balance">
            Brain Cross-Section & Deep Internal Anatomy
          </h2>
          <p className="text-base text-slate-300 leading-relaxed text-balance">
            Slice dynamically through the cerebral cortex using GPU-accelerated WebGL clipping planes. Expose deep subcortical nuclei, ventricular CSF cavities, and the central white-matter core.
          </p>
        </div>

        {/* Section Control Board */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase font-mono text-cyan-400">Section View Controller</div>
              <div className="text-sm font-semibold text-white">Three-Dimensional Clipping Plane</div>
            </div>

            <button
              onClick={() => onSetViewMode(isSectionActive ? 'anatomical' : 'cross-section')}
              className={`px-5 py-2.5 text-xs font-semibold tracking-wider uppercase rounded-lg border transition-all flex items-center gap-2 ${
                isSectionActive
                  ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  : 'bg-slate-900 border-white/10 text-slate-300 hover:text-white hover:border-cyan-500/40'
              }`}
            >
              <Scissors className="w-4 h-4 text-cyan-400" />
              <span>{isSectionActive ? 'Restore Complete Brain' : 'Activate Section View'}</span>
            </button>
          </div>

          {/* Plane Selector & Depth Slider */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4 border-t border-white/5 items-center">
            {/* Plane axis selector */}
            <div className="md:col-span-4 space-y-2">
              <label className="text-xs uppercase font-mono text-slate-400 block">
                Select Anatomical Plane
              </label>
              <div className="flex items-center gap-2 p-1 bg-slate-900/80 rounded-lg border border-white/5">
                {(['sagittal', 'coronal', 'axial'] as const).map((axis) => (
                  <button
                    key={axis}
                    onClick={() => {
                      onSetCrossSectionAxis(axis);
                      if (!isSectionActive) onSetViewMode('cross-section');
                    }}
                    className={`flex-1 py-1.5 text-xs font-mono capitalize rounded-md transition-colors ${
                      crossSectionAxis === axis && isSectionActive
                        ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {axis}
                  </button>
                ))}
              </div>
            </div>

            {/* Depth Slider */}
            <div className="md:col-span-8 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 uppercase">Slice Depth Position</span>
                <span className="text-cyan-400 font-bold tabular-nums">
                  {(crossSectionDepth * 60).toFixed(1)} mm Offset
                </span>
              </div>
              <input
                type="range"
                min="-0.9"
                max="0.9"
                step="0.02"
                value={crossSectionDepth}
                disabled={!isSectionActive}
                onChange={(e) => onSetCrossSectionDepth(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 disabled:opacity-40"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-500">
                <span>Exterior Surface</span>
                <span>Midline / Core</span>
                <span>Contralateral Cortex</span>
              </div>
            </div>
          </div>
        </div>

        {/* Revealed Internal Structures Cards */}
        <div className="space-y-4">
          <div className="text-xs uppercase font-mono text-cyan-400 tracking-wider">
            Exposed Subcortical Structures
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleInternalStructures.map((struct) => (
              <div
                key={struct.id}
                onClick={() => onSelectStructure(struct.id)}
                className="glass-panel p-5 rounded-xl border border-white/5 hover:border-cyan-500/30 cursor-pointer group transition-all text-left"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-cyan-400 tracking-wider">
                      {struct.type}
                    </span>
                    <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors mt-0.5">
                      {struct.name}
                    </h4>
                  </div>
                  <Target className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </div>
                <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                  {struct.desc}
                </p>
                <div className="mt-3 pt-2 border-t border-white/5 text-[11px] font-mono text-cyan-400/90 group-hover:underline">
                  Isolate & Inspect Structure →
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
