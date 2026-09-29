import React from 'react';
import { ViewMode, CameraPreset, BrainStructureId } from '../../types/neuro';
import { Film, Play, ChevronRight, Eye } from 'lucide-react';

interface CinematicTimelineProps {
  currentScene: number;
  onSelectScene: (sceneIndex: number) => void;
  onSetViewMode: (mode: ViewMode) => void;
  onSetPreset: (preset: CameraPreset) => void;
  onSelectStructure: (id: BrainStructureId | null) => void;
}

export const CinematicTimeline: React.FC<CinematicTimelineProps> = ({
  currentScene,
  onSelectScene,
  onSetViewMode,
  onSetPreset,
  onSelectStructure,
}) => {
  const scenes = [
    {
      num: 1,
      title: 'Cosmic Singularity',
      desc: 'Complete human brain floating in deep obsidian space with subtle atmospheric luminescence.',
      mode: 'anatomical' as ViewMode,
      preset: 'hero' as CameraPreset,
      structure: null,
    },
    {
      num: 2,
      title: 'Orbital Approach',
      desc: 'Camera accelerates toward the anterior cranial curvature, revealing convoluted sulci and gyri.',
      mode: 'anatomical' as ViewMode,
      preset: 'anterior' as CameraPreset,
      structure: null,
    },
    {
      num: 3,
      title: 'Cortical Partition',
      desc: 'Hemispheres articulate; frontal, parietal, temporal, and occipital lobes illuminate in sequence.',
      mode: 'anatomical' as ViewMode,
      preset: 'lateral-left' as CameraPreset,
      structure: 'frontal-lobe' as BrainStructureId,
    },
    {
      num: 4,
      title: 'Optical Translucency',
      desc: 'The outer neocortical mantle dissolves into a semi-transparent lattice.',
      mode: 'connectome' as ViewMode,
      preset: 'superior' as CameraPreset,
      structure: null,
    },
    {
      num: 5,
      title: 'Subcortical Core',
      desc: 'Internal structures emerge: thalamus, hippocampus, and arched corpus callosum fibers.',
      mode: 'cross-section' as ViewMode,
      preset: 'sagittal' as CameraPreset,
      structure: 'thalamus' as BrainStructureId,
    },
    {
      num: 6,
      title: 'The White-Matter Highway',
      desc: 'Fascicles of tractography fibers guide the lens through the corticospinal conduit.',
      mode: 'connectome' as ViewMode,
      preset: 'lateral-right' as CameraPreset,
      structure: 'white-matter' as BrainStructureId,
    },
    {
      num: 7,
      title: 'Cellular Pyramidal Soma',
      desc: 'Transition across the 20-micrometer threshold into a multipolar cortical neuron.',
      mode: 'anatomical' as ViewMode,
      preset: 'hero' as CameraPreset,
      structure: 'neurons' as BrainStructureId,
    },
    {
      num: 8,
      title: 'The Synaptic Chasm',
      desc: 'The 20-nanometer intercellular junction between axon terminal bouton and dendritic spine.',
      mode: 'anatomical' as ViewMode,
      preset: 'hero' as CameraPreset,
      structure: 'synapses' as BrainStructureId,
    },
    {
      num: 9,
      title: 'Electrochemical Flux',
      desc: 'Action potentials trigger quantum neurotransmitter vesicle discharge into the synaptic cleft.',
      mode: 'connectome' as ViewMode,
      preset: 'hero' as CameraPreset,
      structure: 'neural-pathways' as BrainStructureId,
    },
    {
      num: 10,
      title: 'Macroscopic Recoil',
      desc: 'Camera accelerates backward through the connectome matrix to restore the unified organ.',
      mode: 'anatomical' as ViewMode,
      preset: 'hero' as CameraPreset,
      structure: null,
    },
  ];

  const handleSceneClick = (index: number) => {
    onSelectScene(index);
    const scene = scenes[index];
    onSetViewMode(scene.mode);
    onSetPreset(scene.preset);
    onSelectStructure(scene.structure);
  };

  return (
    <section className="relative py-24 px-6 md:px-12 border-t border-white/5 bg-[#05070c]/85">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-cyan-400">
            <span>Cinematic Sequence</span>
            <span aria-hidden="true">·</span>
            <span>Ten-Stage Journey</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-display text-balance">
            Cinematic Scroll & Narrative Tour
          </h2>
          <p className="text-base text-slate-300 leading-relaxed text-balance">
            Step through the choreographed cinematic timeline of the human brain. Each chapter reconfigures camera trajectories, material transmission, and anatomical highlights.
          </p>
        </div>

        {/* Scene Cards Carousel / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {scenes.map((scene, idx) => {
            const isActive = currentScene === idx;
            return (
              <div
                key={scene.num}
                onClick={() => handleSceneClick(idx)}
                className={`cursor-pointer rounded-xl p-5 border transition-all text-left flex flex-col justify-between group ${
                  isActive
                    ? 'glass-panel-glow border-cyan-400 bg-gradient-to-b from-cyan-950/40 to-slate-900/60 ring-1 ring-cyan-400/40'
                    : 'glass-panel hover:border-cyan-500/30 hover:bg-slate-900/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                    <span>Scene 0{scene.num}</span>
                    {isActive && <Eye className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />}
                  </div>
                  <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors mt-1.5">
                    {scene.title}
                  </h4>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed line-clamp-3">
                    {scene.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>{scene.mode}</span>
                  <span className="text-cyan-400 group-hover:underline">Play Stage →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
