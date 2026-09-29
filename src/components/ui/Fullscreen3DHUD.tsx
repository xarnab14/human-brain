import React from 'react';
import { ViewMode, CameraPreset, CognitiveFunction, BrainStructureId } from '../../types/neuro';
import { 
  X, RotateCw, Compass, Sliders, Zap, Droplet, Scissors, Brain, 
  Layers, ChevronDown, Radio, Activity, Eye 
} from 'lucide-react';
import { BRAIN_STRUCTURES } from '../../data/neuroData';

interface Fullscreen3DHUDProps {
  onExit: () => void;
  viewMode: ViewMode;
  onSetViewMode: (mode: ViewMode) => void;
  activePreset: CameraPreset;
  onSetPreset: (preset: CameraPreset) => void;
  isAutoRotating: boolean;
  onToggleAutoRotate: () => void;
  neuralActivity: number;
  onNeuralActivityChange: (val: number) => void;
  showBloodFlow: boolean;
  onToggleBloodFlow: () => void;
  crossSectionAxis: 'sagittal' | 'coronal' | 'axial';
  onSetCrossSectionAxis: (axis: 'sagittal' | 'coronal' | 'axial') => void;
  crossSectionDepth: number;
  onSetCrossSectionDepth: (depth: number) => void;
  cognitiveMode: CognitiveFunction;
  onSetCognitiveMode: (mode: CognitiveFunction) => void;
  selectedStructure: BrainStructureId | null;
  onSelectStructure: (id: BrainStructureId | null) => void;
}

export const Fullscreen3DHUD: React.FC<Fullscreen3DHUDProps> = ({
  onExit,
  viewMode,
  onSetViewMode,
  activePreset,
  onSetPreset,
  isAutoRotating,
  onToggleAutoRotate,
  neuralActivity,
  onNeuralActivityChange,
  showBloodFlow,
  onToggleBloodFlow,
  crossSectionAxis,
  onSetCrossSectionAxis,
  crossSectionDepth,
  onSetCrossSectionDepth,
  cognitiveMode,
  onSetCognitiveMode,
  selectedStructure,
  onSelectStructure,
}) => {
  const viewModes: Array<{ id: ViewMode; label: string; icon: React.ReactNode }> = [
    { id: 'anatomical', label: 'Anatomy', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'connectome', label: 'Connectome', icon: <Zap className="w-3.5 h-3.5" /> },
    { id: 'cross-section', label: 'Section View', icon: <Scissors className="w-3.5 h-3.5" /> },
    { id: 'circulation', label: 'Circulation', icon: <Droplet className="w-3.5 h-3.5" /> },
    { id: 'cognitive', label: 'Cognition', icon: <Brain className="w-3.5 h-3.5" /> },
  ];

  const presets: Array<{ id: CameraPreset; label: string }> = [
    { id: 'anterior', label: 'Anterior' },
    { id: 'posterior', label: 'Posterior' },
    { id: 'superior', label: 'Superior' },
    { id: 'lateral-left', label: 'Lateral L' },
    { id: 'lateral-right', label: 'Lateral R' },
    { id: 'sagittal', label: 'Sagittal' },
    { id: 'inferior', label: 'Inferior' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-40 flex flex-col justify-between p-4 sm:p-6">
      {/* Top HUD Bar */}
      <div className="flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-slate-300 bg-slate-950/80 hover:bg-slate-900 border border-white/10 rounded-xl flex items-center gap-2 backdrop-blur-md shadow-xl transition-all"
          >
            <X className="w-4 h-4 text-cyan-400" />
            <span>Exit 3D Mode</span>
          </button>

          {/* Current Mode Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/60 backdrop-blur-md border border-white/5 text-xs font-mono text-cyan-400 uppercase">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>Mode: {viewMode}</span>
          </div>
        </div>

        {/* View Mode Segmented Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-950/80 backdrop-blur-md rounded-xl border border-white/10 shadow-xl overflow-x-auto max-w-[55vw] sm:max-w-none">
          {viewModes.map((vm) => (
            <button
              key={vm.id}
              onClick={() => onSetViewMode(vm.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                viewMode === vm.id
                  ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {vm.icon}
              <span className="hidden md:inline">{vm.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Floating Left Quick Structure Selector */}
      <div className="hidden md:block self-start my-auto pointer-events-auto max-h-[60vh] overflow-y-auto space-y-1.5 p-3 rounded-2xl glass-panel border border-white/10 w-52">
        <div className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 px-2 pb-1">
          Quick Anatomy Focus
        </div>
        {[
          'frontal-lobe',
          'parietal-lobe',
          'temporal-lobe',
          'occipital-lobe',
          'cerebellum',
          'brainstem',
          'thalamus',
          'hippocampus',
          'amygdala',
          'corpus-callosum',
        ].map((id) => {
          const item = BRAIN_STRUCTURES[id];
          if (!item) return null;
          const isSelected = selectedStructure === id;
          return (
            <button
              key={id}
              onClick={() => onSelectStructure(isSelected ? null : (id as BrainStructureId))}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                isSelected
                  ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="truncate">{item.name}</span>
              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
            </button>
          );
        })}
      </div>

      {/* Bottom Floating Control Deck */}
      <div className="pointer-events-auto max-w-4xl mx-auto w-full space-y-3">
        {/* Dynamic Contextual Sub-Controls based on View Mode */}
        {viewMode === 'connectome' && (
          <div className="glass-panel p-3.5 rounded-xl border border-white/10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase">
              <Zap className="w-4 h-4" />
              <span>Connectome Impulse Velocity</span>
            </div>
            <div className="flex items-center gap-3 flex-1 max-w-xs">
              <input
                type="range"
                min="5"
                max="100"
                value={neuralActivity}
                onChange={(e) => onNeuralActivityChange(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <span className="text-xs font-mono text-cyan-300 tabular-nums w-12 text-right">
                {neuralActivity}%
              </span>
            </div>
          </div>
        )}

        {viewMode === 'cross-section' && (
          <div className="glass-panel p-3.5 rounded-xl border border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-slate-400">Plane:</span>
              {(['sagittal', 'coronal', 'axial'] as const).map((axis) => (
                <button
                  key={axis}
                  onClick={() => onSetCrossSectionAxis(axis)}
                  className={`px-2.5 py-1 text-xs font-mono capitalize rounded ${
                    crossSectionAxis === axis
                      ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {axis}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 flex-1 max-w-xs">
              <span className="text-xs font-mono uppercase text-slate-400">Depth:</span>
              <input
                type="range"
                min="-0.9"
                max="0.9"
                step="0.02"
                value={crossSectionDepth}
                onChange={(e) => onSetCrossSectionDepth(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          </div>
        )}

        {viewMode === 'circulation' && (
          <div className="glass-panel p-3.5 rounded-xl border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-rose-400 uppercase">
              <Droplet className="w-4 h-4" />
              <span>Arterial Blood Stream Velocity</span>
            </div>
            <button
              onClick={onToggleBloodFlow}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                showBloodFlow
                  ? 'bg-rose-500/20 text-rose-200 border-rose-400'
                  : 'bg-slate-900 border-white/10 text-slate-400'
              }`}
            >
              {showBloodFlow ? 'Streaming Erythrocytes' : 'Flow Paused'}
            </button>
          </div>
        )}

        {viewMode === 'cognitive' && (
          <div className="glass-panel p-2.5 rounded-xl border border-white/10 flex items-center gap-1.5 overflow-x-auto">
            {(['memory', 'vision', 'hearing', 'movement', 'language', 'attention', 'emotion'] as CognitiveFunction[]).map((c) => (
              <button
                key={c}
                onClick={() => onSetCognitiveMode(c)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize whitespace-nowrap transition-colors ${
                  cognitiveMode === c
                    ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/50'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {/* Master Camera Presets & Orbit Controls */}
        <div className="glass-panel p-3 rounded-2xl border border-white/10 flex items-center justify-between gap-3 overflow-x-auto">
          {/* Auto rotate toggle */}
          <button
            onClick={onToggleAutoRotate}
            className={`px-3 py-1.5 text-xs font-mono rounded-lg border flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              isAutoRotating
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'text-slate-400 hover:text-white border-white/10'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin' : ''}`} />
            <span>Orbit {isAutoRotating ? 'On' : 'Off'}</span>
          </button>

          {/* Camera angle presets */}
          <div className="flex items-center gap-1">
            {presets.map((p) => (
              <button
                key={p.id}
                onClick={() => onSetPreset(p.id)}
                className={`px-2.5 py-1.5 text-xs font-mono rounded-md transition-colors whitespace-nowrap ${
                  activePreset === p.id
                    ? 'bg-white/15 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="hidden lg:block text-[11px] font-mono text-slate-500 whitespace-nowrap pr-2">
            Orbit: Drag · Zoom: Wheel / Pinch
          </div>
        </div>
      </div>
    </div>
  );
};
