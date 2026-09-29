export type BrainStructureId =
  // Lobes & Major Regions
  | 'frontal-lobe'
  | 'parietal-lobe'
  | 'temporal-lobe'
  | 'occipital-lobe'
  | 'cerebellum'
  | 'brainstem'
  | 'insula'
  // Deep Structures
  | 'thalamus'
  | 'hypothalamus'
  | 'hippocampus'
  | 'amygdala'
  | 'basal-ganglia'
  | 'corpus-callosum'
  | 'pituitary-gland'
  | 'pineal-gland'
  | 'ventricles'
  // Neural Systems
  | 'neurons'
  | 'axons'
  | 'dendrites'
  | 'synapses'
  | 'white-matter'
  | 'gray-matter'
  | 'neural-pathways'
  | 'blood-vessels';

export type ViewMode = 
  | 'anatomical' 
  | 'connectome' 
  | 'cross-section' 
  | 'circulation' 
  | 'cognitive' 
  | 'microscopic';

export type CognitiveFunction = 
  | 'all'
  | 'memory' 
  | 'vision' 
  | 'hearing' 
  | 'movement' 
  | 'language' 
  | 'attention' 
  | 'emotion';

export type CameraPreset = 
  | 'hero' 
  | 'anterior' 
  | 'posterior' 
  | 'superior' 
  | 'lateral-left' 
  | 'lateral-right' 
  | 'sagittal' 
  | 'inferior';

export interface BrainStructureInfo {
  id: BrainStructureId;
  name: string;
  category: 'Lobes' | 'Deep Structures' | 'Neural Systems' | 'Brainstem & Cerebellum';
  latinName: string;
  location: string;
  primaryFunction: string;
  detailedDescription: string;
  relatedStructures: string[];
  keyNeurotransmitters: string[];
  clinicalSignificance: string;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  color: string;
}

export interface CognitiveCircuitInfo {
  id: CognitiveFunction;
  name: string;
  primaryRegions: string[];
  description: string;
  neurotransmitters: string[];
  frequencyBand: string;
  clinicalRelevance: string;
}
