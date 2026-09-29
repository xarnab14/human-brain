import React from 'react';
import { ViewMode } from '../../types/neuro';
import { Droplet, Heart, Activity, AlertTriangle, ShieldCheck } from 'lucide-react';

interface CirculationSectionProps {
  viewMode: ViewMode;
  onSetViewMode: (mode: ViewMode) => void;
  showBloodFlow: boolean;
  onToggleBloodFlow: () => void;
}

export const CirculationSection: React.FC<CirculationSectionProps> = ({
  viewMode,
  onSetViewMode,
  showBloodFlow,
  onToggleBloodFlow,
}) => {
  const isCirculationActive = viewMode === 'circulation';

  const vascularBranches = [
    {
      name: 'Circle of Willis',
      latin: 'Circulus arteriosus cerebri',
      role: 'Arterial Anastomosis',
      desc: 'Heptagonal arterial ring at the skull base providing collateral perfusion between carotid and vertebrobasilar systems.',
    },
    {
      name: 'Middle Cerebral Artery (MCA)',
      latin: 'Arteria cerebri media',
      role: 'Primary Cortical Conduit',
      desc: 'Supplies the entire lateral surface of the frontal, parietal, and temporal lobes. The most common site of ischemic thromboembolism.',
    },
    {
      name: 'Anterior Cerebral Artery (ACA)',
      latin: 'Arteria cerebri anterior',
      role: 'Medial Hemispheric Perfusion',
      desc: 'Curves around the corpus callosum to irrigate medial sensorimotor strip areas governing the lower extremity and pelvic floor.',
    },
    {
      name: 'Posterior Cerebral Artery (PCA)',
      latin: 'Arteria cerebri posterior',
      role: 'Occipital & Visual Supply',
      desc: 'Terminal bifurcation of the basilar artery supplying the primary visual cortex (calcarine area) and inferior temporal lobes.',
    },
    {
      name: 'Basilar & Vertebral Trunk',
      latin: 'Arteria basilaris',
      role: 'Posterior Fossa Circulation',
      desc: 'Ascends across the anterior pons to perfuse the brainstem, cerebellum, and ascending reticular activating system.',
    },
  ];

  return (
    <section id="circulation" className="relative py-24 px-6 md:px-12 border-t border-white/5 bg-[#05070c]/80">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-rose-400">
            <span>Cerebral Hemodynamics</span>
            <span aria-hidden="true">·</span>
            <span>Neurovascular Tree</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-display text-balance">
            Cerebral Blood Vessels & The Circle of Willis
          </h2>
          <p className="text-base text-slate-300 leading-relaxed text-balance">
            The brain commands 20% of cardiac output despite comprising only 2% of body mass. Observe the vital arterial network with real-time erythrocyte flow particles and collateral safety pathways.
          </p>
        </div>

        {/* Controller Bar */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase font-mono text-rose-400">Vasculature Visualization</div>
              <div className="text-sm font-semibold text-white">Angiographic Vasculature & Corpuscle Flow</div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onToggleBloodFlow}
                className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase rounded-lg border transition-all flex items-center gap-2 ${
                  showBloodFlow
                    ? 'bg-rose-500/20 text-rose-200 border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                    : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <Droplet className="w-4 h-4 text-rose-400" />
                <span>Blood Flow: {showBloodFlow ? 'Streaming' : 'Paused'}</span>
              </button>

              <button
                onClick={() => onSetViewMode(isCirculationActive ? 'anatomical' : 'circulation')}
                className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase rounded-lg border transition-all flex items-center gap-2 ${
                  isCirculationActive
                    ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : 'bg-slate-900 border-white/10 text-slate-300 hover:text-white'
                }`}
              >
                <Heart className="w-4 h-4 text-rose-400" />
                <span>{isCirculationActive ? 'Restore Surface' : 'Enable Vasculature View'}</span>
              </button>
            </div>
          </div>

          {/* Key Hemodynamic Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/5">
            <div>
              <div className="text-xl font-bold font-mono text-white tabular-nums">750 mL/min</div>
              <div className="text-xs text-slate-400">Total Cerebral Perfusion</div>
            </div>
            <div>
              <div className="text-xl font-bold font-mono text-rose-400 tabular-nums">50 mL/100g/min</div>
              <div className="text-xs text-slate-400">Critical Ischemic Threshold</div>
            </div>
            <div>
              <div className="text-xl font-bold font-mono text-white tabular-nums">400 miles</div>
              <div className="text-xs text-slate-400">Total Capillary Length</div>
            </div>
            <div>
              <div className="text-xl font-bold font-mono text-cyan-400 tabular-nums">&lt;100 ms</div>
              <div className="text-xs text-slate-400">Neurovascular Coupling Lag</div>
            </div>
          </div>
        </div>

        {/* Arterial Branches Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vascularBranches.map((vessel, idx) => (
            <div
              key={idx}
              className="glass-panel p-5 rounded-xl border border-white/5 hover:border-rose-500/30 transition-all text-left"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-rose-400 tracking-wider">
                    {vessel.role}
                  </span>
                  <h4 className="text-base font-bold text-white mt-0.5">{vessel.name}</h4>
                  <div className="text-[11px] font-mono text-slate-400 italic">{vessel.latin}</div>
                </div>
                <Droplet className="w-4 h-4 text-rose-500" />
              </div>
              <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">{vessel.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
