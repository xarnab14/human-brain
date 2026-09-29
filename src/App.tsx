import React, { useState, useEffect } from 'react';
import { ViewMode, CognitiveFunction, CameraPreset, BrainStructureId } from './types/neuro';
import { BrainCanvas } from './components/3d/BrainCanvas';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/ui/HeroSection';
import { InformationCard } from './components/ui/InformationCard';
import { AnatomyExplorer } from './components/ui/AnatomyExplorer';
import { LobesSection } from './components/ui/LobesSection';
import { NeuralConnectomeSection } from './components/ui/NeuralConnectomeSection';
import { MicroscopicSynapseSection } from './components/ui/MicroscopicSynapseSection';
import { CrossSectionSection } from './components/ui/CrossSectionSection';
import { CirculationSection } from './components/ui/CirculationSection';
import { CognitiveActivitySection } from './components/ui/CognitiveActivitySection';
import { CinematicTimeline } from './components/ui/CinematicTimeline';
import { AiResearchLab } from './components/ui/AiResearchLab';
import { Fullscreen3DHUD } from './components/ui/Fullscreen3DHUD';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { Footer } from './components/ui/Footer';
import { neuralAudio } from './utils/audioSynth';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [is3DFullscreen, setIs3DFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('anatomical');
  const [selectedStructure, setSelectedStructure] = useState<BrainStructureId | null>(null);
  const [hoveredStructure, setHoveredStructure] = useState<BrainStructureId | null>(null);
  const [cognitiveMode, setCognitiveMode] = useState<CognitiveFunction>('memory');
  const [neuralActivity, setNeuralActivity] = useState<number>(65);
  const [showBloodFlow, setShowBloodFlow] = useState<boolean>(true);
  const [crossSectionAxis, setCrossSectionAxis] = useState<'sagittal' | 'coronal' | 'axial'>('sagittal');
  const [crossSectionDepth, setCrossSectionDepth] = useState<number>(0);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [activePreset, setActivePreset] = useState<CameraPreset>('hero');
  const [currentScene, setCurrentScene] = useState<number>(0);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [audioActive, setAudioActive] = useState<boolean>(false);

  // Audio mute sync
  const handleToggleAudio = () => {
    const nextState = !audioActive;
    setAudioActive(nextState);
    neuralAudio.setMuted(!nextState);
  };

  const handleSelectStructure = (id: BrainStructureId | null) => {
    setSelectedStructure(id);
    if (id) {
      neuralAudio.playSelectTone();
    }
  };

  const handleEnter3DMode = () => {
    setIs3DFullscreen((prev) => !prev);
    neuralAudio.playPulse();
  };

  return (
    <div className="relative min-h-screen bg-[#05070c] text-slate-100 overflow-x-hidden selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* 1. Cinematic Initial Loading Screen */}
      {isLoading && <LoadingScreen onLoaded={() => setIsLoading(false)} />}

      {/* 2. Top Navigation Bar */}
      {!is3DFullscreen && (
        <Navbar
          onEnter3DMode={handleEnter3DMode}
          is3DFullscreen={is3DFullscreen}
          reducedMotion={reducedMotion}
          onToggleReducedMotion={() => setReducedMotion((prev) => !prev)}
          audioActive={audioActive}
          onToggleAudio={handleToggleAudio}
        />
      )}

      {/* 3. Master 3D WebGL Canvas Layer */}
      <div
        className={`transition-all duration-700 ${
          is3DFullscreen
            ? 'fixed inset-0 z-30 w-screen h-screen'
            : 'fixed top-0 right-0 w-full lg:w-[65vw] h-screen pointer-events-auto z-0 opacity-90'
        }`}
      >
        <BrainCanvas
          viewMode={viewMode}
          selectedStructure={selectedStructure}
          onSelectStructure={handleSelectStructure}
          hoveredStructure={hoveredStructure}
          onHoverStructure={setHoveredStructure}
          cognitiveMode={cognitiveMode}
          neuralActivity={neuralActivity}
          showBloodFlow={showBloodFlow}
          crossSectionAxis={crossSectionAxis}
          crossSectionDepth={crossSectionDepth}
          isAutoRotating={isAutoRotating}
          reducedMotion={reducedMotion}
          activePreset={activePreset}
          onPresetChange={setActivePreset}
        />
      </div>

      {/* 4. Fullscreen 3D Dedicated Cockpit HUD */}
      {is3DFullscreen && (
        <Fullscreen3DHUD
          onExit={() => setIs3DFullscreen(false)}
          viewMode={viewMode}
          onSetViewMode={setViewMode}
          activePreset={activePreset}
          onSetPreset={setActivePreset}
          isAutoRotating={isAutoRotating}
          onToggleAutoRotate={() => setIsAutoRotating((prev) => !prev)}
          neuralActivity={neuralActivity}
          onNeuralActivityChange={setNeuralActivity}
          showBloodFlow={showBloodFlow}
          onToggleBloodFlow={() => setShowBloodFlow((prev) => !prev)}
          crossSectionAxis={crossSectionAxis}
          onSetCrossSectionAxis={setCrossSectionAxis}
          crossSectionDepth={crossSectionDepth}
          onSetCrossSectionDepth={setCrossSectionDepth}
          cognitiveMode={cognitiveMode}
          onSetCognitiveMode={setCognitiveMode}
          selectedStructure={selectedStructure}
          onSelectStructure={handleSelectStructure}
        />
      )}

      {/* 5. Floating Anatomical Information Card */}
      <InformationCard
        structureId={selectedStructure}
        onClose={() => setSelectedStructure(null)}
        onFocus3D={(id) => {
          setSelectedStructure(id);
          neuralAudio.playSelectTone();
        }}
      />

      {/* 6. Document Scroll Flow (when not in full 3D immersion) */}
      {!is3DFullscreen && (
        <main className="relative z-10">
          {/* Hero Section */}
          <HeroSection
            onExploreClick={() => {
              const el = document.getElementById('lobes');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            onEnter3DMode={handleEnter3DMode}
          />

          {/* The Four Cerebral Lobes Section */}
          <LobesSection
            selectedStructure={selectedStructure}
            onSelectLobe={handleSelectStructure}
            onHoverLobe={setHoveredStructure}
          />

          {/* Anatomical Exploration & Taxonomy */}
          <AnatomyExplorer
            selectedStructure={selectedStructure}
            onSelectStructure={handleSelectStructure}
          />

          {/* Neural Connectome & Fiber Pathways */}
          <NeuralConnectomeSection
            viewMode={viewMode}
            onSetViewMode={setViewMode}
            neuralActivity={neuralActivity}
            onNeuralActivityChange={setNeuralActivity}
          />

          {/* Microscopic Synapse & Action Potential Simulator */}
          <MicroscopicSynapseSection reducedMotion={reducedMotion} />

          {/* Brain Cross-Section Clipping Plane View */}
          <CrossSectionSection
            viewMode={viewMode}
            onSetViewMode={setViewMode}
            crossSectionAxis={crossSectionAxis}
            onSetCrossSectionAxis={setCrossSectionAxis}
            crossSectionDepth={crossSectionDepth}
            onSetCrossSectionDepth={setCrossSectionDepth}
            onSelectStructure={handleSelectStructure}
          />

          {/* Cerebral Circulation & Circle of Willis */}
          <CirculationSection
            viewMode={viewMode}
            onSetViewMode={setViewMode}
            showBloodFlow={showBloodFlow}
            onToggleBloodFlow={() => setShowBloodFlow((prev) => !prev)}
          />

          {/* Cognitive Networks & Functional Brain Activity */}
          <CognitiveActivitySection
            cognitiveMode={cognitiveMode}
            onSelectCognitiveMode={setCognitiveMode}
            viewMode={viewMode}
            onSetViewMode={setViewMode}
          />

          {/* Ten-Scene Cinematic Narrative Timeline */}
          <CinematicTimeline
            currentScene={currentScene}
            onSelectScene={setCurrentScene}
            onSetViewMode={setViewMode}
            onSetPreset={setActivePreset}
            onSelectStructure={handleSelectStructure}
          />

          {/* AI Neuroscience Research Engine */}
          <AiResearchLab />

          {/* Minimalist Scientific Footer */}
          <Footer />
        </main>
      )}
    </div>
  );
}
