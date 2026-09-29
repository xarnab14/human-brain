import React from 'react';
import { X, Target, Sparkles, BookOpen, AlertCircle, Compass } from 'lucide-react';
import { BrainStructureId } from '../../types/neuro';
import { BRAIN_STRUCTURES } from '../../data/neuroData';

interface InformationCardProps {
  structureId: BrainStructureId | null;
  onClose: () => void;
  onFocus3D?: (id: BrainStructureId) => void;
}

export const InformationCard: React.FC<InformationCardProps> = ({
  structureId,
  onClose,
  onFocus3D,
}) => {
  if (!structureId || !BRAIN_STRUCTURES[structureId]) return null;

  const data = BRAIN_STRUCTURES[structureId];

  return (
    <aside
      aria-label="Anatomical structure details"
      className="fixed bottom-6 right-6 md:right-10 z-40 w-[92vw] sm:w-[420px] max-h-[85vh] overflow-y-auto glass-panel-glow rounded-2xl p-6 text-slate-100 shadow-2xl transition-all duration-300"
    >
      {/* Header bar */}
      <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <span>{data.category}</span>
            <span aria-hidden="true">·</span>
            <span className="italic text-slate-400">{data.latinName}</span>
          </div>
          <h3 className="text-2xl font-bold tracking-tight font-display text-white mt-1">
            {data.name}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="py-4 space-y-4 text-xs sm:text-sm">
        {/* Anatomical Location */}
        <div>
          <span className="text-slate-400 block text-xs uppercase tracking-wider font-mono mb-1">
            Location
          </span>
          <p className="text-slate-200 leading-relaxed">{data.location}</p>
        </div>

        {/* Primary Function */}
        <div>
          <span className="text-slate-400 block text-xs uppercase tracking-wider font-mono mb-1">
            Primary Function
          </span>
          <p className="text-slate-200 leading-relaxed">{data.primaryFunction}</p>
        </div>

        {/* Detailed Description */}
        <div>
          <span className="text-slate-400 block text-xs uppercase tracking-wider font-mono mb-1">
            Neuroanatomy & Circuitry
          </span>
          <p className="text-slate-300 leading-relaxed text-xs">{data.detailedDescription}</p>
        </div>

        {/* Neurotransmitters & Related Structures */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <span className="text-slate-400 block text-xs uppercase tracking-wider font-mono mb-1">
              Neurotransmitters
            </span>
            <div className="flex flex-wrap gap-1.5 text-xs text-cyan-300">
              {data.keyNeurotransmitters.join(' · ')}
            </div>
          </div>
          <div>
            <span className="text-slate-400 block text-xs uppercase tracking-wider font-mono mb-1">
              Interconnections
            </span>
            <div className="text-xs text-slate-300">
              {data.relatedStructures.slice(0, 3).join(' · ')}
            </div>
          </div>
        </div>

        {/* Clinical Significance */}
        <div className="bg-slate-900/60 p-3 rounded-lg border border-white/5 space-y-1">
          <div className="flex items-center gap-1.5 text-amber-400 text-xs font-mono">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Clinical Significance</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{data.clinicalSignificance}</p>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="pt-2 border-t border-white/10 flex items-center justify-between">
        <button
          onClick={() => onFocus3D && onFocus3D(data.id)}
          className="px-3.5 py-1.5 text-xs font-medium text-cyan-200 bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/30 rounded-lg flex items-center gap-1.5 transition-colors"
        >
          <Target className="w-3.5 h-3.5" />
          <span>Align Camera Focus</span>
        </button>

        <button
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-white transition-colors"
        >
          Dismiss
        </button>
      </div>
    </aside>
  );
};
