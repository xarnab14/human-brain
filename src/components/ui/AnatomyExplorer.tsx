import React, { useState } from 'react';
import { Layers, ChevronRight, Sparkles, Compass } from 'lucide-react';
import { BrainStructureId } from '../../types/neuro';
import { BRAIN_STRUCTURES } from '../../data/neuroData';

interface AnatomyExplorerProps {
  selectedStructure: BrainStructureId | null;
  onSelectStructure: (id: BrainStructureId) => void;
}

export const AnatomyExplorer: React.FC<AnatomyExplorerProps> = ({
  selectedStructure,
  onSelectStructure,
}) => {
  const [activeTab, setActiveTab] = useState<'Lobes' | 'Deep Structures' | 'Neural Systems'>('Lobes');

  const categories = [
    { id: 'Lobes', label: 'Cerebral Lobes & Major Regions' },
    { id: 'Deep Structures', label: 'Subcortical & Deep Nuclei' },
    { id: 'Neural Systems', label: 'Cellular & Circuit Systems' },
  ] as const;

  const filteredStructures = Object.values(BRAIN_STRUCTURES).filter((item) => {
    if (activeTab === 'Lobes') {
      return item.category === 'Lobes' || item.category === 'Brainstem & Cerebellum';
    }
    return item.category === activeTab;
  });

  return (
    <section id="anatomy" className="relative py-24 px-6 md:px-12 border-t border-white/5 bg-[#05070c]/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-cyan-400">
            <span>Anatomical Taxonomy</span>
            <span aria-hidden="true">·</span>
            <span>Spatial Exploration</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-display text-balance">
            Interactive Anatomy Navigation
          </h2>
          <p className="text-base text-slate-300 leading-relaxed text-balance">
            Select any cortical lobe, subcortical nuclear complex, or micro-circuit. The 3D camera will dynamically orbit, refocus, and isolate the structure with real-time biometric metrics.
          </p>
        </div>

        {/* Category Tabs (Interactive Filter Buttons obeying skill rules) */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-900/80 rounded-xl border border-white/5 w-fit overflow-x-auto max-w-full">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id as any)}
              className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase rounded-lg transition-all whitespace-nowrap ${
                activeTab === cat.id
                  ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Structures Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStructures.map((structure) => {
            const isSelected = selectedStructure === structure.id;
            return (
              <div
                key={structure.id}
                onClick={() => onSelectStructure(structure.id)}
                className={`group cursor-pointer rounded-xl p-5 transition-all duration-300 border text-left ${
                  isSelected
                    ? 'glass-panel-glow border-cyan-400/60 ring-1 ring-cyan-400/40 transform -translate-y-1'
                    : 'glass-panel hover:border-cyan-500/30 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-1">
                      {structure.latinName}
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {structure.name}
                    </h3>
                  </div>
                  <div
                    className={`p-1.5 rounded-lg border transition-colors ${
                      isSelected
                        ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200'
                        : 'border-white/10 text-slate-400 group-hover:text-white group-hover:border-cyan-500/30'
                    }`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>

                <p className="mt-2.5 text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {structure.primaryFunction}
                </p>

                {/* Metadata row */}
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>{structure.category}</span>
                  <span className="text-cyan-400/90 group-hover:underline">Focus 3D View →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
