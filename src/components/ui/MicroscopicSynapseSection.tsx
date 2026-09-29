import React, { useState } from 'react';
import { SynapseCanvas } from '../3d/SynapseCanvas';
import { Zap, Play, Sparkles, Sliders, ChevronRight, Info } from 'lucide-react';

interface MicroscopicSynapseSectionProps {
  reducedMotion: boolean;
}

export const MicroscopicSynapseSection: React.FC<MicroscopicSynapseSectionProps> = ({
  reducedMotion,
}) => {
  const [neurotransmitter, setNeurotransmitter] = useState<'dopamine' | 'serotonin' | 'glutamate' | 'gaba'>('dopamine');
  const [firingRate, setFiringRate] = useState<number>(5);
  const [isFiringSpike, setIsFiringSpike] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(6); // Synapse is step 6

  const zoomHierarchy = [
    { label: 'Human Brain', scale: '150 mm', desc: 'Macroscopic organ with bilateral cerebral hemispheres' },
    { label: 'Brain Region', scale: '25 mm', desc: 'Cortical lobe or subcortical nucleus' },
    { label: 'Neural Pathway', scale: '5 mm', desc: 'Fascicle of myelinated axonal tracts' },
    { label: 'Neuron', scale: '20 µm', desc: 'Soma, dendritic arbor, and axon hillock' },
    { label: 'Dendrite', scale: '2 µm', desc: 'Postsynaptic branch studded with spines' },
    { label: 'Axon Terminal', scale: '1 µm', desc: 'Presynaptic bouton packed with vesicles' },
    { label: 'Synaptic Cleft', scale: '20 nm', desc: 'Intercellular junction for chemical neurotransmission' },
  ];

  const handleTriggerActionPotential = () => {
    setIsFiringSpike(true);
    setTimeout(() => {
      setIsFiringSpike(false);
    }, 1800);
  };

  return (
    <section id="synapse" className="relative py-24 px-6 md:px-12 border-t border-white/5 bg-[#05070c]">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-cyan-400">
            <span>The Neural Network</span>
            <span aria-hidden="true">·</span>
            <span>Microscopic Resolution</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-display text-balance">
            Microscopic Architecture: The Chemical Synapse
          </h2>
          <p className="text-base text-slate-300 leading-relaxed text-balance">
            Zoom across seven orders of magnitude—from the 150-millimeter brain down to the 20-nanometer synaptic cleft. Inspect action potential propagation, SNARE-mediated vesicle fusion, and receptor excitation in real time.
          </p>
        </div>

        {/* Cinematic Scale Hierarchy Stepper */}
        <div className="p-4 bg-slate-900/60 rounded-2xl border border-white/5 overflow-x-auto">
          <div className="flex items-center gap-3 min-w-[700px]">
            {zoomHierarchy.map((step, idx) => (
              <React.Fragment key={idx}>
                <button
                  onClick={() => setActiveStep(idx)}
                  className={`flex-1 p-3 rounded-xl text-left border transition-all ${
                    activeStep === idx
                      ? 'bg-cyan-500/20 border-cyan-400/80 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                      : 'border-white/5 hover:border-white/20 bg-slate-950/40 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="text-[10px] font-mono uppercase text-cyan-400">
                    Step 0{idx + 1} · {step.scale}
                  </div>
                  <div className="text-xs font-bold text-white mt-0.5">{step.label}</div>
                  <div className="text-[11px] text-slate-400 line-clamp-1 mt-1">{step.desc}</div>
                </button>
                {idx < zoomHierarchy.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Interactive 3D Synapse Viewport & Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: 3D Interactive Canvas */}
          <div className="lg:col-span-8 space-y-4">
            <SynapseCanvas
              neurotransmitterType={neurotransmitter}
              firingRate={firingRate}
              actionPotentialTriggered={isFiringSpike}
              reducedMotion={reducedMotion}
            />

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 glass-panel rounded-xl border border-white/10">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleTriggerActionPotential}
                  disabled={isFiringSpike}
                  className="px-5 py-2.5 text-xs font-semibold tracking-wider uppercase text-slate-950 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center gap-2 transition-all active:scale-95"
                >
                  <Zap className="w-4 h-4" />
                  <span>{isFiringSpike ? 'Transmitting Voltage Spike...' : 'Fire Action Potential'}</span>
                </button>

                <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                  Velocity: ~100 m/s
                </span>
              </div>

              {/* Neurotransmitter Selector */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-lg border border-white/5">
                {(['dopamine', 'serotonin', 'glutamate', 'gaba'] as const).map((nt) => (
                  <button
                    key={nt}
                    onClick={() => setNeurotransmitter(nt)}
                    className={`px-3 py-1.5 text-xs font-mono capitalize rounded-md transition-colors ${
                      neurotransmitter === nt
                        ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {nt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Scientific Reference & Electron Micrograph Assets */}
          <div className="lg:col-span-4 space-y-4">
            <div className="glass-panel p-5 rounded-xl border border-white/10 space-y-3">
              <div className="text-xs font-mono uppercase text-cyan-400">Selected Transmitter</div>
              <h4 className="text-xl font-bold font-display text-white capitalize">
                {neurotransmitter === 'dopamine' && 'Dopamine (DA)'}
                {neurotransmitter === 'serotonin' && 'Serotonin (5-HT)'}
                {neurotransmitter === 'glutamate' && 'Glutamate (Glu)'}
                {neurotransmitter === 'gaba' && 'GABA (γ-Aminobutyric Acid)'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {neurotransmitter === 'dopamine' &&
                  'Catecholamine neurotransmitter essential for reward prediction error, motor initiation via the striatum, and working memory gating in the prefrontal cortex.'}
                {neurotransmitter === 'serotonin' &&
                  'Indolamine neurotransmitter synthesized in dorsal raphe nuclei, modulating mood stability, impulsivity, sleep architecture, and pain threshold.'}
                {neurotransmitter === 'glutamate' &&
                  'The primary excitatory neurotransmitter of the human CNS. Binds AMPA and NMDA ionotropic receptors to trigger rapid depolarization and induce Long-Term Potentiation (LTP).'}
                {neurotransmitter === 'gaba' &&
                  'The primary inhibitory neurotransmitter of the mammalian brain. Opens GABAA chloride channels to hyperpolarize the postsynaptic membrane, suppressing runaway excitability.'}
              </p>
            </div>

            {/* Electron Micrograph Card */}
            <div className="relative rounded-xl overflow-hidden border border-white/10 glass-panel">
              <img
                src="/src/assets/images/microscopic_synapse_cleft_1790597505809.jpg"
                alt="Scientific 3D visualization of chemical synapse transmission"
                referrerPolicy="no-referrer"
                className="w-full h-44 object-cover"
              />
              <div className="p-3 bg-slate-950/80">
                <div className="text-[11px] font-mono text-cyan-400 uppercase">3D Electron Tomography</div>
                <div className="text-xs font-semibold text-white">Synaptic Vesicle Exocytosis</div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Showing SNARE pin-complex fusion and neurotransmitter quantum discharge into the synaptic cleft.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
