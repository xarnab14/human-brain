import React from 'react';
import { BrainStructureId } from '../../types/neuro';
import { Compass, Sparkles, CheckCircle2 } from 'lucide-react';

interface LobesSectionProps {
  selectedStructure: BrainStructureId | null;
  onSelectLobe: (id: BrainStructureId) => void;
  onHoverLobe: (id: BrainStructureId | null) => void;
}

export const LobesSection: React.FC<LobesSectionProps> = ({
  selectedStructure,
  onSelectLobe,
  onHoverLobe,
}) => {
  const lobes = [
    {
      id: 'frontal-lobe' as BrainStructureId,
      name: 'Frontal Lobe',
      subtitle: 'Executive Orchestration & Voluntary Motion',
      description:
        'Associated with decision-making, planning, future simulation, executive control, working memory, and primary motor execution along the precentral gyrus.',
      landmarks: ['Prefrontal Cortex', 'Primary Motor Strip (M1)', 'Broca Area (BA 44/45)'],
      color: 'from-cyan-500/20 to-sky-500/5',
      borderColor: 'hover:border-cyan-400',
    },
    {
      id: 'parietal-lobe' as BrainStructureId,
      name: 'Parietal Lobe',
      subtitle: 'Somatosensory Mapping & Spatial Integration',
      description:
        'Processes somatic sensory input, proprioceptive body schema, multisensory spatial coordinates, numerical processing, and attentional orientation.',
      landmarks: ['Postcentral Gyrus (S1)', 'Superior Parietal Lobule', 'Angular & Supramarginal Gyri'],
      color: 'from-sky-500/20 to-blue-500/5',
      borderColor: 'hover:border-sky-400',
    },
    {
      id: 'temporal-lobe' as BrainStructureId,
      name: 'Temporal Lobe',
      subtitle: 'Audition, Language Comprehension & Episodic Memory',
      description:
        'Crucial for auditory spectrotemporal decoding, language comprehension via Wernicke area, face recognition via the fusiform gyrus, and memory consolidation via the medial hippocampus.',
      landmarks: ['Heschl Gyrus (A1)', 'Wernicke Area (BA 22)', 'Fusiform Face Area (FFA)'],
      color: 'from-indigo-500/20 to-purple-500/5',
      borderColor: 'hover:border-indigo-400',
    },
    {
      id: 'occipital-lobe' as BrainStructureId,
      name: 'Occipital Lobe',
      subtitle: 'Retinotopic Hierarchy & Primary Vision',
      description:
        'Dedicated to visual perception. Translates retinal projections along the calcarine sulcus (striate cortex V1) into hierarchical color, orientation, depth, and motion channels.',
      landmarks: ['Primary Visual Cortex (V1)', 'Calcarine Sulcus', 'Extrastriate Areas (V2-V5)'],
      color: 'from-violet-500/20 to-fuchsia-500/5',
      borderColor: 'hover:border-violet-400',
    },
  ];

  return (
    <section id="lobes" className="relative py-24 px-6 md:px-12 border-t border-white/5 bg-[#05070c]/90">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-cyan-400">
            <span>Cerebral Cortical Architecture</span>
            <span aria-hidden="true">·</span>
            <span>Four Neocortical Lobes</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-display text-balance">
            The Four Cerebral Lobes
          </h2>
          <p className="text-base text-slate-300 leading-relaxed text-balance">
            Hover or select any cerebral lobe below to illuminate its cortical boundaries on the 3D brain and inspect its functional subdivisions.
          </p>
        </div>

        {/* 4 Lobes Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lobes.map((lobe) => {
            const isSelected = selectedStructure === lobe.id;
            return (
              <div
                key={lobe.id}
                onClick={() => onSelectLobe(lobe.id)}
                onMouseEnter={() => onHoverLobe(lobe.id)}
                onMouseLeave={() => onHoverLobe(null)}
                className={`relative cursor-pointer rounded-2xl p-7 transition-all duration-300 border text-left flex flex-col justify-between overflow-hidden group ${
                  isSelected
                    ? 'glass-panel-glow border-cyan-400 ring-1 ring-cyan-400/40 bg-gradient-to-br from-cyan-950/40 to-slate-900/60'
                    : `glass-panel ${lobe.borderColor} hover:bg-slate-900/60`
                }`}
              >
                {/* Subtle ambient gradient mesh */}
                <div
                  className={`absolute -right-16 -top-16 w-44 h-44 rounded-full blur-3xl opacity-20 pointer-events-none bg-gradient-to-br ${lobe.color}`}
                />

                <div className="space-y-4 relative z-10">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-mono tracking-wider uppercase text-cyan-400">
                        {lobe.subtitle}
                      </span>
                      <h3 className="text-2xl font-bold font-display text-white mt-1 group-hover:text-cyan-300 transition-colors">
                        {lobe.name}
                      </h3>
                    </div>
                    <span
                      className={`text-xs font-mono px-2.5 py-1 rounded border transition-colors ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200'
                          : 'border-white/10 text-slate-400 group-hover:text-white'
                      }`}
                    >
                      {isSelected ? 'Active Focus' : 'Select'}
                    </span>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed font-light">
                    {lobe.description}
                  </p>

                  {/* Key landmarks */}
                  <div className="pt-2">
                    <span className="text-xs uppercase font-mono tracking-wider text-slate-400 block mb-2">
                      Key Functional Landmarks
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {lobe.landmarks.map((landmark, idx) => (
                        <span
                          key={idx}
                          className="text-xs text-slate-300 bg-white/5 border border-white/5 px-2.5 py-1 rounded"
                        >
                          {landmark}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="group-hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5" /> Orbit & Align 3D Camera
                  </span>
                  <span className="text-slate-500">Neocortex Layer I-VI</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
