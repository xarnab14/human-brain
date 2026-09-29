import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { ViewMode, CognitiveFunction, CameraPreset, BrainStructureId } from '../../types/neuro';
import { BRAIN_STRUCTURES } from '../../data/neuroData';

interface BrainCanvasProps {
  viewMode: ViewMode;
  selectedStructure: BrainStructureId | null;
  onSelectStructure: (id: BrainStructureId | null) => void;
  hoveredStructure: BrainStructureId | null;
  onHoverStructure: (id: BrainStructureId | null) => void;
  cognitiveMode: CognitiveFunction;
  neuralActivity: number; // 0 to 100
  showBloodFlow: boolean;
  crossSectionAxis: 'sagittal' | 'coronal' | 'axial';
  crossSectionDepth: number; // -1 to 1
  isAutoRotating: boolean;
  reducedMotion: boolean;
  activePreset: CameraPreset;
  onPresetChange?: (preset: CameraPreset) => void;
}

export const BrainCanvas: React.FC<BrainCanvasProps> = ({
  viewMode,
  selectedStructure,
  onSelectStructure,
  hoveredStructure,
  onHoverStructure,
  cognitiveMode,
  neuralActivity,
  showBloodFlow,
  crossSectionAxis,
  crossSectionDepth,
  isAutoRotating,
  reducedMotion,
  activePreset,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const brainGroupRef = useRef<THREE.Group | null>(null);

  // Anatomical mesh groups
  const cortexGroupRef = useRef<THREE.Group | null>(null);
  const deepStructuresGroupRef = useRef<THREE.Group | null>(null);
  const connectomeGroupRef = useRef<THREE.Group | null>(null);
  const vasculatureGroupRef = useRef<THREE.Group | null>(null);

  // Dynamic objects
  const pulseParticlesRef = useRef<THREE.Points | null>(null);
  const bloodParticlesRef = useRef<THREE.Points | null>(null);
  const clippingPlaneRef = useRef<THREE.Plane>(new THREE.Plane(new THREE.Vector3(1, 0, 0), 2.5));

  // Raycasting & Interaction
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mousePosRef = useRef<THREE.Vector2>(new THREE.Vector2(-1000, -1000));
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const targetRotationRef = useRef<{ x: number; y: number }>({ x: 0.1, y: 0.2 });
  const currentRotationRef = useRef<{ x: number; y: number }>({ x: 0.1, y: 0.2 });

  // Camera lerp targets
  const targetCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.4, 5.2));
  const targetCamLookRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const currentCamLookRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  // Lobe mesh references for highlights
  const lobeMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());

  // Interactive tooltip state
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number; visible: boolean }>({
    text: '',
    x: 0,
    y: 0,
    visible: false,
  });

  // Camera Presets dictionary
  const presetPositions: Record<CameraPreset, [number, number, number]> = {
    hero: [0, 0.4, 5.2],
    anterior: [0, 0.2, 5.4],
    posterior: [0, 0.3, -5.4],
    superior: [0, 6.0, 0.01],
    'lateral-left': [-5.4, 0.2, 0],
    'lateral-right': [5.4, 0.2, 0],
    sagittal: [-4.6, 0.4, 0.8],
    inferior: [0, -5.6, 0.01],
  };

  // Update target camera when preset or selected structure changes
  useEffect(() => {
    if (selectedStructure && BRAIN_STRUCTURES[selectedStructure]) {
      const info = BRAIN_STRUCTURES[selectedStructure];
      targetCamPosRef.current.set(...info.cameraPosition);
      targetCamLookRef.current.set(...info.cameraTarget);
    } else {
      const pos = presetPositions[activePreset] || presetPositions.hero;
      targetCamPosRef.current.set(...pos);
      targetCamLookRef.current.set(0, 0, 0);
    }
  }, [selectedStructure, activePreset]);

  // Update clipping plane based on section view
  useEffect(() => {
    if (viewMode === 'cross-section') {
      const normal = 
        crossSectionAxis === 'sagittal' ? new THREE.Vector3(1, 0, 0) :
        crossSectionAxis === 'coronal' ? new THREE.Vector3(0, 0, 1) :
        new THREE.Vector3(0, 1, 0);
      
      const constant = crossSectionDepth * 2.2;
      clippingPlaneRef.current.normal.copy(normal);
      clippingPlaneRef.current.constant = constant;
    } else {
      // Disabled / placed far away
      clippingPlaneRef.current.normal.set(1, 0, 0);
      clippingPlaneRef.current.constant = 10.0;
    }
  }, [viewMode, crossSectionAxis, crossSectionDepth]);

  // Primary Three.js setup
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // SCENE
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070c, 0.045);
    sceneRef.current = scene;

    // CAMERA
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 5.2);
    cameraRef.current = camera;

    // RENDERER
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.localClippingEnabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // LIGHTING: 3-point studio + volumetric rim
    const ambientLight = new THREE.AmbientLight(0x0f1c3f, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xe0f2fe, 2.4);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.5);
    fillLight.position.set(-4, -2, -2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x06b6d4, 3.2);
    rimLight.position.set(0, 4, -5);
    scene.add(rimLight);

    const bottomGlow = new THREE.PointLight(0x0ea5e9, 1.8, 8);
    bottomGlow.position.set(0, -3, 0);
    scene.add(bottomGlow);

    // MASTER BRAIN GROUP
    const brainGroup = new THREE.Group();
    scene.add(brainGroup);
    brainGroupRef.current = brainGroup;

    // 1. CORTEX GROUP (Left & Right Hemispheres + Lobes)
    const cortexGroup = new THREE.Group();
    brainGroup.add(cortexGroup);
    cortexGroupRef.current = cortexGroup;

    // Build anatomical brain mesh
    buildAnatomicalBrain(cortexGroup, lobeMeshesRef.current, clippingPlaneRef.current);

    // 2. DEEP SUBCORTICAL STRUCTURES
    const deepGroup = new THREE.Group();
    brainGroup.add(deepGroup);
    deepStructuresGroupRef.current = deepGroup;
    buildDeepStructures(deepGroup, clippingPlaneRef.current);

    // 3. NEURAL CONNECTOME FIBERS & PULSES
    const connectomeGroup = new THREE.Group();
    brainGroup.add(connectomeGroup);
    connectomeGroupRef.current = connectomeGroup;
    const { fiberLines, pulsePoints } = buildConnectomeFibers();
    connectomeGroup.add(fiberLines);
    connectomeGroup.add(pulsePoints);
    pulseParticlesRef.current = pulsePoints;

    // 4. CEREBRAL CIRCULATION & BLOOD FLOW
    const vasculatureGroup = new THREE.Group();
    brainGroup.add(vasculatureGroup);
    vasculatureGroupRef.current = vasculatureGroup;
    const { vessels, bloodPoints } = buildVasculature();
    vasculatureGroup.add(vessels);
    vasculatureGroup.add(bloodPoints);
    bloodParticlesRef.current = bloodPoints;

    // 5. SUBTLE AMBIENT PARTICLES
    const ambientParticleGeo = new THREE.BufferGeometry();
    const particleCount = 200;
    const pCoords = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      pCoords[i] = (Math.random() - 0.5) * 8;
      pCoords[i + 1] = (Math.random() - 0.5) * 6;
      pCoords[i + 2] = (Math.random() - 0.5) * 8;
    }
    ambientParticleGeo.setAttribute('position', new THREE.BufferAttribute(pCoords, 3));
    const ambientParticleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.03,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });
    const ambientParticles = new THREE.Points(ambientParticleGeo, ambientParticleMat);
    scene.add(ambientParticles);

    // RESIZE LISTENER
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // ANIMATION LOOP
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Slow idle auto-rotation if enabled and not actively dragging
      if (isAutoRotating && !isDraggingRef.current && !reducedMotion) {
        targetRotationRef.current.y += delta * 0.15;
      }

      // Smooth rotation damping
      currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.08;
      currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.08;
      brainGroup.rotation.x = currentRotationRef.current.x;
      brainGroup.rotation.y = currentRotationRef.current.y;

      // Smooth camera position interpolation
      camera.position.lerp(targetCamPosRef.current, reducedMotion ? 1 : 0.05);

      // Smooth look-at target interpolation
      currentCamLookRef.current.lerp(targetCamLookRef.current, reducedMotion ? 1 : 0.06);
      camera.lookAt(currentCamLookRef.current);

      // Connectome pulses update
      if (pulseParticlesRef.current) {
        const positions = pulseParticlesRef.current.geometry.attributes.position.array as Float32Array;
        const progressArr = (pulseParticlesRef.current.geometry as any).userData?.progress;
        const curves = (pulseParticlesRef.current.geometry as any).userData?.curves;
        
        if (progressArr && curves) {
          const speedFactor = (neuralActivity / 100) * 0.4 + 0.1;
          for (let i = 0; i < progressArr.length; i++) {
            progressArr[i] = (progressArr[i] + delta * speedFactor) % 1.0;
            const curve = curves[i % curves.length];
            const pt = curve.getPoint(progressArr[i]);
            positions[i * 3] = pt.x;
            positions[i * 3 + 1] = pt.y;
            positions[i * 3 + 2] = pt.z;
          }
          pulseParticlesRef.current.geometry.attributes.position.needsUpdate = true;
        }
      }

      // Blood flow particles update
      if (bloodParticlesRef.current && showBloodFlow) {
        const bloodPos = bloodParticlesRef.current.geometry.attributes.position.array as Float32Array;
        const bProgress = (bloodParticlesRef.current.geometry as any).userData?.progress;
        const bCurves = (bloodParticlesRef.current.geometry as any).userData?.curves;
        if (bProgress && bCurves) {
          for (let i = 0; i < bProgress.length; i++) {
            bProgress[i] = (bProgress[i] + delta * 0.35) % 1.0;
            const curve = bCurves[i % bCurves.length];
            const pt = curve.getPoint(bProgress[i]);
            bloodPos[i * 3] = pt.x;
            bloodPos[i * 3 + 1] = pt.y;
            bloodPos[i * 3 + 2] = pt.z;
          }
          bloodParticlesRef.current.geometry.attributes.position.needsUpdate = true;
        }
      }

      // Subtle float on ambient particles
      ambientParticles.rotation.y = elapsed * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update visibility and material styling on mode switch
  useEffect(() => {
    if (!cortexGroupRef.current || !connectomeGroupRef.current || !vasculatureGroupRef.current || !deepStructuresGroupRef.current) return;

    const isConnectome = viewMode === 'connectome';
    const isCirculation = viewMode === 'circulation';
    const isCrossSection = viewMode === 'cross-section';
    const isCognitive = viewMode === 'cognitive';

    // Cortex transparency/opacity
    cortexGroupRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.MeshPhysicalMaterial;
        if (mat) {
          if (isConnectome) {
            mat.transparent = true;
            mat.opacity = 0.18;
            mat.roughness = 0.8;
            mat.wireframe = false;
          } else if (isCirculation) {
            mat.transparent = true;
            mat.opacity = 0.22;
          } else if (isCrossSection) {
            mat.transparent = false;
            mat.opacity = 1.0;
          } else {
            mat.transparent = false;
            mat.opacity = 1.0;
          }
        }
      }
    });

    // Connectome visibility
    connectomeGroupRef.current.visible = isConnectome || viewMode === 'anatomical';
    if (connectomeGroupRef.current.children[0]) {
      // lines
      (connectomeGroupRef.current.children[0] as THREE.LineSegments).material = 
        new THREE.LineBasicMaterial({
          color: 0x06b6d4,
          transparent: true,
          opacity: isConnectome ? 0.75 : 0.22,
          blending: THREE.AdditiveBlending,
        });
    }

    // Vasculature visibility
    vasculatureGroupRef.current.visible = isCirculation;

    // Deep structures visibility
    deepStructuresGroupRef.current.visible = isCrossSection || isConnectome || (selectedStructure !== null && BRAIN_STRUCTURES[selectedStructure]?.category === 'Deep Structures');
  }, [viewMode, selectedStructure]);

  // Update Cognitive Functional Activations
  useEffect(() => {
    if (!cortexGroupRef.current) return;

    lobeMeshesRef.current.forEach((mesh, structureId) => {
      const mat = mesh.material as THREE.MeshPhysicalMaterial;
      if (!mat) return;

      const isSelected = selectedStructure === structureId;
      const isHovered = hoveredStructure === structureId;

      if (viewMode === 'cognitive') {
        let isActivated = false;
        let activeColor = new THREE.Color(0x0ea5e9);

        if (cognitiveMode === 'vision' && structureId === 'occipital-lobe') {
          isActivated = true;
          activeColor.set(0x38bdf8);
        } else if (cognitiveMode === 'language' && (structureId === 'temporal-lobe' || structureId === 'frontal-lobe')) {
          isActivated = true;
          activeColor.set(0x818cf8);
        } else if (cognitiveMode === 'memory' && (structureId === 'temporal-lobe' || structureId === 'hippocampus')) {
          isActivated = true;
          activeColor.set(0x10b981);
        } else if (cognitiveMode === 'movement' && (structureId === 'frontal-lobe' || structureId === 'cerebellum')) {
          isActivated = true;
          activeColor.set(0xf59e0b);
        } else if (cognitiveMode === 'hearing' && structureId === 'temporal-lobe') {
          isActivated = true;
          activeColor.set(0x06b6d4);
        } else if (cognitiveMode === 'emotion' && (structureId === 'insula' || structureId === 'amygdala')) {
          isActivated = true;
          activeColor.set(0xf43f5e);
        } else if (cognitiveMode === 'attention' && (structureId === 'frontal-lobe' || structureId === 'parietal-lobe')) {
          isActivated = true;
          activeColor.set(0xa855f7);
        }

        if (isActivated) {
          mat.emissive.copy(activeColor);
          mat.emissiveIntensity = 0.85;
          mat.roughness = 0.3;
        } else {
          mat.emissive.set(0x020712);
          mat.emissiveIntensity = 0.1;
          mat.roughness = 0.65;
        }
      } else {
        // Standard Anatomical or Connectome highlighting
        if (isSelected) {
          mat.emissive.set(0x0ea5e9);
          mat.emissiveIntensity = 0.95;
        } else if (isHovered) {
          mat.emissive.set(0x38bdf8);
          mat.emissiveIntensity = 0.45;
        } else {
          mat.emissive.set(0x040814);
          mat.emissiveIntensity = 0.12;
        }
      }
    });
  }, [cognitiveMode, viewMode, selectedStructure, hoveredStructure]);

  // Pointer drag to orbit
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const container = containerRef.current;
    if (!container || !cameraRef.current || !sceneRef.current) return;

    const rect = container.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    mousePosRef.current.set(mouseX, mouseY);

    if (isDraggingRef.current) {
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      targetRotationRef.current.y += deltaX * 0.006;
      targetRotationRef.current.x += deltaY * 0.006;
      // Clamp vertical rotation
      targetRotationRef.current.x = Math.max(-Math.PI * 0.45, Math.min(Math.PI * 0.45, targetRotationRef.current.x));

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    } else {
      // Raycast hover check
      raycasterRef.current.setFromCamera(mousePosRef.current, cameraRef.current);
      const interactiveMeshes = Array.from(lobeMeshesRef.current.values());
      const intersects = raycasterRef.current.intersectObjects(interactiveMeshes, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const structId = hit.userData?.structureId as BrainStructureId;
        if (structId && BRAIN_STRUCTURES[structId]) {
          onHoverStructure(structId);
          setTooltip({
            text: BRAIN_STRUCTURES[structId].name,
            x: e.clientX,
            y: e.clientY,
            visible: true,
          });
          return;
        }
      }
      onHoverStructure(null);
      setTooltip((prev) => ({ ...prev, visible: false }));
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleClick = (e: React.MouseEvent) => {
    // If not a significant drag, treat as click
    if (!cameraRef.current || !sceneRef.current) return;
    raycasterRef.current.setFromCamera(mousePosRef.current, cameraRef.current);
    const interactiveMeshes = Array.from(lobeMeshesRef.current.values());
    const intersects = raycasterRef.current.intersectObjects(interactiveMeshes, false);

    if (intersects.length > 0) {
      const hit = intersects[0].object as THREE.Mesh;
      const structId = hit.userData?.structureId as BrainStructureId;
      if (structId) {
        onSelectStructure(structId);
      }
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!cameraRef.current) return;
    const zoomFactor = e.deltaY * 0.003;
    const newZ = Math.max(2.0, Math.min(8.5, targetCamPosRef.current.z + zoomFactor));
    targetCamPosRef.current.z = newZ;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full cursor-grab active:cursor-grabbing select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={handleClick}
      onWheel={handleWheel}
      style={{ touchAction: 'none' }}
    >
      {/* Floating Hover Tooltip */}
      {tooltip.visible && (
        <div
          className="fixed pointer-events-none z-50 px-2.5 py-1 text-xs font-semibold tracking-wide text-cyan-200 bg-slate-950/80 backdrop-blur-md border border-cyan-500/30 rounded shadow-lg transform -translate-x-1/2 -translate-y-9"
          style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
};

// ==========================================
// PROCEDURAL ANATOMICAL BRAIN BUILDER
// ==========================================

function buildAnatomicalBrain(
  group: THREE.Group,
  lobeMeshesMap: Map<string, THREE.Mesh>,
  clippingPlane: THREE.Plane
) {
  // Lobe specs defining anatomical spatial coordinates, radii, noise frequencies
  const lobesConfig: Array<{
    id: BrainStructureId;
    side: 'left' | 'right' | 'both';
    center: [number, number, number];
    radii: [number, number, number];
    baseColor: number;
    roughness: number;
  }> = [
    // FRONTAL LOBE: Anterior superior bulk
    { id: 'frontal-lobe', side: 'left', center: [-0.68, 0.42, 0.75], radii: [0.72, 0.78, 0.95], baseColor: 0x1e3a5f, roughness: 0.5 },
    { id: 'frontal-lobe', side: 'right', center: [0.68, 0.42, 0.75], radii: [0.72, 0.78, 0.95], baseColor: 0x1e3a5f, roughness: 0.5 },
    
    // PARIETAL LOBE: Superior posterior crest
    { id: 'parietal-lobe', side: 'left', center: [-0.72, 0.78, -0.42], radii: [0.74, 0.75, 0.88], baseColor: 0x1d3557, roughness: 0.52 },
    { id: 'parietal-lobe', side: 'right', center: [0.72, 0.78, -0.42], radii: [0.74, 0.75, 0.88], baseColor: 0x1d3557, roughness: 0.52 },

    // TEMPORAL LOBE: Inferolateral belly
    { id: 'temporal-lobe', side: 'left', center: [-1.08, -0.22, 0.22], radii: [0.65, 0.55, 0.92], baseColor: 0x223366, roughness: 0.5 },
    { id: 'temporal-lobe', side: 'right', center: [1.08, -0.22, 0.22], radii: [0.65, 0.55, 0.92], baseColor: 0x223366, roughness: 0.5 },

    // OCCIPITAL LOBE: Posterior wedge
    { id: 'occipital-lobe', side: 'left', center: [-0.62, 0.05, -1.25], radii: [0.62, 0.65, 0.75], baseColor: 0x273469, roughness: 0.55 },
    { id: 'occipital-lobe', side: 'right', center: [0.62, 0.05, -1.25], radii: [0.62, 0.65, 0.75], baseColor: 0x273469, roughness: 0.55 },

    // CEREBELLUM: Inferoposterior horizontal striated folia
    { id: 'cerebellum', side: 'left', center: [-0.58, -0.92, -0.95], radii: [0.55, 0.48, 0.62], baseColor: 0x183a3a, roughness: 0.65 },
    { id: 'cerebellum', side: 'right', center: [0.58, -0.92, -0.95], radii: [0.55, 0.48, 0.62], baseColor: 0x183a3a, roughness: 0.65 },

    // BRAINSTEM: Ventral midline column (Pons & Medulla)
    { id: 'brainstem', side: 'both', center: [0, -1.15, -0.25], radii: [0.38, 0.82, 0.38], baseColor: 0x16384c, roughness: 0.45 },
  ];

  lobesConfig.forEach((cfg) => {
    // High subdivision sphere deformed with gyri/sulci harmonic formula
    const sphereGeo = new THREE.SphereGeometry(1, 48, 36);
    const posAttr = sphereGeo.attributes.position;
    const vertex = new THREE.Vector3();

    for (let i = 0; i < posAttr.count; i++) {
      vertex.fromBufferAttribute(posAttr, i);

      // Anatomical shape scaling
      vertex.x *= cfg.radii[0];
      vertex.y *= cfg.radii[1];
      vertex.z *= cfg.radii[2];

      // Gyri & Sulci procedural folding: multi-scale sinusoidal harmonic displacement
      const nx = vertex.x * 3.8;
      const ny = vertex.y * 3.8;
      const nz = vertex.z * 3.8;

      let sulciNoise = 
        Math.sin(nx * 2.2 + ny * 1.8) * Math.cos(nz * 2.5) * 0.08 +
        Math.sin(ny * 4.5 + nz * 3.5) * 0.04 +
        Math.sin(nx * 8.0) * Math.cos(ny * 8.0) * 0.015;

      // Special folia texture for cerebellum (horizontal parallel grooves)
      if (cfg.id === 'cerebellum') {
        sulciNoise = Math.sin(vertex.y * 28.0) * 0.05 + Math.sin(vertex.x * 6.0) * 0.02;
      }

      // Smooth brainstem
      if (cfg.id === 'brainstem') {
        sulciNoise *= 0.2;
      }

      const length = vertex.length();
      if (length > 0) {
        vertex.addScaledVector(vertex.clone().normalize(), sulciNoise);
      }

      posAttr.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }

    sphereGeo.computeVertexNormals();

    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(cfg.baseColor),
      roughness: cfg.roughness,
      metalness: 0.12,
      clearcoat: 0.35,
      clearcoatRoughness: 0.25,
      emissive: new THREE.Color(0x020712),
      emissiveIntensity: 0.1,
      clippingPlanes: [clippingPlane],
      clipShadows: true,
    });

    const mesh = new THREE.Mesh(sphereGeo, mat);
    mesh.position.set(...cfg.center);
    mesh.userData = { structureId: cfg.id };

    group.add(mesh);
    lobeMeshesMap.set(`${cfg.id}-${cfg.side}`, mesh);
  });
}

// ==========================================
// DEEP SUBCORTICAL STRUCTURES
// ==========================================

function buildDeepStructures(group: THREE.Group, clippingPlane: THREE.Plane) {
  // 1. CORPUS CALLOSUM: C-shaped curved white matter arch
  const callosumCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.05, 0.8), // Genu
    new THREE.Vector3(0, 0.45, 0.3),  // Body
    new THREE.Vector3(0, 0.52, -0.3),
    new THREE.Vector3(0, 0.22, -0.75), // Splenium
  ]);
  const callosumGeo = new THREE.TubeGeometry(callosumCurve, 32, 0.14, 16, false);
  const callosumMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    roughness: 0.4,
    metalness: 0.2,
    emissive: 0x0369a1,
    emissiveIntensity: 0.35,
    clippingPlanes: [clippingPlane],
  });
  const callosumMesh = new THREE.Mesh(callosumGeo, callosumMat);
  group.add(callosumMesh);

  // 2. THALAMUS: Paired ovoid nuclear complex
  const thalamusGeo = new THREE.SphereGeometry(0.32, 24, 20);
  thalamusGeo.scale(0.8, 0.9, 1.25);
  const thalamusMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 0.45,
    roughness: 0.35,
    clippingPlanes: [clippingPlane],
  });
  const thalamusLeft = new THREE.Mesh(thalamusGeo, thalamusMat);
  thalamusLeft.position.set(-0.35, 0.15, -0.15);
  group.add(thalamusLeft);

  const thalamusRight = new THREE.Mesh(thalamusGeo, thalamusMat);
  thalamusRight.position.set(0.35, 0.15, -0.15);
  group.add(thalamusRight);

  // 3. HIPPOCAMPUS: Seahorse-curved bilateral horns in medial temporal
  const hippoCurveLeft = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.75, -0.42, 0.25),
    new THREE.Vector3(-0.72, -0.35, -0.1),
    new THREE.Vector3(-0.62, -0.25, -0.45),
  ]);
  const hippoGeoLeft = new THREE.TubeGeometry(hippoCurveLeft, 24, 0.1, 12, false);
  const hippoMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    emissive: 0x059669,
    emissiveIntensity: 0.5,
    roughness: 0.3,
    clippingPlanes: [clippingPlane],
  });
  const hippoLeft = new THREE.Mesh(hippoGeoLeft, hippoMat);
  group.add(hippoLeft);

  const hippoCurveRight = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.75, -0.42, 0.25),
    new THREE.Vector3(0.72, -0.35, -0.1),
    new THREE.Vector3(0.62, -0.25, -0.45),
  ]);
  const hippoGeoRight = new THREE.TubeGeometry(hippoCurveRight, 24, 0.1, 12, false);
  const hippoRight = new THREE.Mesh(hippoGeoRight, hippoMat);
  group.add(hippoRight);

  // 4. AMYGDALA: Almond-shaped nuclei anterior to hippocampus
  const amygdalaGeo = new THREE.SphereGeometry(0.14, 16, 16);
  amygdalaGeo.scale(1.1, 0.9, 1.3);
  const amygdalaMat = new THREE.MeshStandardMaterial({
    color: 0xf43f5e,
    emissive: 0xe11d48,
    emissiveIntensity: 0.55,
    roughness: 0.3,
    clippingPlanes: [clippingPlane],
  });
  const amygdalaLeft = new THREE.Mesh(amygdalaGeo, amygdalaMat);
  amygdalaLeft.position.set(-0.72, -0.45, 0.42);
  group.add(amygdalaLeft);

  const amygdalaRight = new THREE.Mesh(amygdalaGeo, amygdalaMat);
  amygdalaRight.position.set(0.72, -0.45, 0.42);
  group.add(amygdalaRight);

  // 5. HYPOTHALAMUS: Below thalamus
  const hypoGeo = new THREE.SphereGeometry(0.2, 16, 16);
  hypoGeo.scale(1.2, 0.8, 1.1);
  const hypoMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    emissive: 0xd97706,
    emissiveIntensity: 0.5,
    roughness: 0.35,
    clippingPlanes: [clippingPlane],
  });
  const hypoMesh = new THREE.Mesh(hypoGeo, hypoMat);
  hypoMesh.position.set(0, -0.18, 0.08);
  group.add(hypoMesh);
}

// ==========================================
// CONNECTOME FIBER TRACTOGRAPHY & PULSES
// ==========================================

function buildConnectomeFibers() {
  const lineCount = 140;
  const linePositions: number[] = [];
  const curves: THREE.CatmullRomCurve3[] = [];

  // Generate anatomical tract pathways:
  // 1. Transcallosal commissural fibers
  // 2. Corticospinal projection fibers
  // 3. Superior longitudinal association fibers
  for (let i = 0; i < lineCount; i++) {
    const angle = (i / lineCount) * Math.PI * 2;
    const type = i % 3;

    let pts: THREE.Vector3[] = [];

    if (type === 0) {
      // Commissural Callosal arch
      const span = 0.8 + Math.random() * 0.4;
      pts = [
        new THREE.Vector3(-span, -0.2 + (Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 1.2),
        new THREE.Vector3(-span * 0.5, 0.45 + (Math.random() - 0.5) * 0.2, (Math.random() - 0.5) * 0.8),
        new THREE.Vector3(0, 0.55 + (Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.6),
        new THREE.Vector3(span * 0.5, 0.45 + (Math.random() - 0.5) * 0.2, (Math.random() - 0.5) * 0.8),
        new THREE.Vector3(span, -0.2 + (Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 1.2),
      ];
    } else if (type === 1) {
      // Corticospinal descending fibers
      const side = Math.random() > 0.5 ? 1 : -1;
      const rad = 0.4 + Math.random() * 0.5;
      pts = [
        new THREE.Vector3(side * rad, 0.8 + Math.random() * 0.4, (Math.random() - 0.5) * 0.5),
        new THREE.Vector3(side * rad * 0.7, 0.3, (Math.random() - 0.5) * 0.3),
        new THREE.Vector3(side * 0.25, -0.2, -0.1),
        new THREE.Vector3(side * 0.12, -0.8, -0.25),
        new THREE.Vector3(0, -1.4, -0.3),
      ];
    } else {
      // Longitudinal association fibers
      const side = Math.random() > 0.5 ? 1 : -1;
      const yLvl = 0.2 + Math.random() * 0.5;
      pts = [
        new THREE.Vector3(side * (0.6 + Math.random() * 0.3), yLvl, 0.8),
        new THREE.Vector3(side * (0.8 + Math.random() * 0.2), yLvl + 0.2, 0.1),
        new THREE.Vector3(side * (0.6 + Math.random() * 0.3), yLvl - 0.1, -0.9),
      ];
    }

    const curve = new THREE.CatmullRomCurve3(pts);
    curves.push(curve);

    const sampledPts = curve.getPoints(24);
    for (let j = 0; j < sampledPts.length - 1; j++) {
      linePositions.push(
        sampledPts[j].x, sampledPts[j].y, sampledPts[j].z,
        sampledPts[j + 1].x, sampledPts[j + 1].y, sampledPts[j + 1].z
      );
    }
  }

  // Fiber lines geometry
  const linesGeo = new THREE.BufferGeometry();
  linesGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  const linesMat = new THREE.LineBasicMaterial({
    color: 0x06b6d4,
    transparent: true,
    opacity: 0.35,
    blending: THREE.AdditiveBlending,
  });
  const fiberLines = new THREE.LineSegments(linesGeo, linesMat);

  // Traveling pulses
  const pulseCount = 180;
  const pulsePositions = new Float32Array(pulseCount * 3);
  const pulseProgress = new Float32Array(pulseCount);

  for (let i = 0; i < pulseCount; i++) {
    pulseProgress[i] = Math.random();
    const curve = curves[i % curves.length];
    const pt = curve.getPoint(pulseProgress[i]);
    pulsePositions[i * 3] = pt.x;
    pulsePositions[i * 3 + 1] = pt.y;
    pulsePositions[i * 3 + 2] = pt.z;
  }

  const pulseGeo = new THREE.BufferGeometry();
  pulseGeo.setAttribute('position', new THREE.BufferAttribute(pulsePositions, 3));
  (pulseGeo as any).userData = { progress: pulseProgress, curves };

  const pulseMat = new THREE.PointsMaterial({
    color: 0x38bdf8,
    size: 0.07,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending,
  });
  const pulsePoints = new THREE.Points(pulseGeo, pulseMat);

  return { fiberLines, pulsePoints };
}

// ==========================================
// CEREBRAL CIRCULATION & BLOOD FLOW
// ==========================================

function buildVasculature() {
  const vesselCurves: THREE.CatmullRomCurve3[] = [
    // Circle of Willis ring
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -0.5, 0.3), // ACoA
      new THREE.Vector3(0.35, -0.52, 0.15), // Right ICA
      new THREE.Vector3(0.28, -0.55, -0.15), // Right PCoA
      new THREE.Vector3(0, -0.58, -0.3), // Basilar bifurcation
      new THREE.Vector3(-0.28, -0.55, -0.15), // Left PCoA
      new THREE.Vector3(-0.35, -0.52, 0.15), // Left ICA
      new THREE.Vector3(0, -0.5, 0.3),
    ]),
    // Basilar Artery trunk
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -1.4, -0.3),
      new THREE.Vector3(0, -1.0, -0.28),
      new THREE.Vector3(0, -0.58, -0.3),
    ]),
    // Middle Cerebral Artery (MCA) - Left
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.35, -0.52, 0.15),
      new THREE.Vector3(-0.65, -0.4, 0.2),
      new THREE.Vector3(-0.95, -0.1, 0.25),
      new THREE.Vector3(-1.15, 0.25, 0.1),
    ]),
    // Middle Cerebral Artery (MCA) - Right
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.35, -0.52, 0.15),
      new THREE.Vector3(0.65, -0.4, 0.2),
      new THREE.Vector3(0.95, -0.1, 0.25),
      new THREE.Vector3(1.15, 0.25, 0.1),
    ]),
    // Anterior Cerebral Artery (ACA) - Left
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.08, -0.5, 0.3),
      new THREE.Vector3(-0.1, 0.1, 0.65),
      new THREE.Vector3(-0.15, 0.5, 0.5),
      new THREE.Vector3(-0.18, 0.6, -0.2),
    ]),
    // Anterior Cerebral Artery (ACA) - Right
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.08, -0.5, 0.3),
      new THREE.Vector3(0.1, 0.1, 0.65),
      new THREE.Vector3(0.15, 0.5, 0.5),
      new THREE.Vector3(0.18, 0.6, -0.2),
    ]),
    // Posterior Cerebral Artery (PCA) - Left
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.12, -0.58, -0.3),
      new THREE.Vector3(-0.45, -0.5, -0.55),
      new THREE.Vector3(-0.65, -0.2, -0.95),
    ]),
    // Posterior Cerebral Artery (PCA) - Right
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.12, -0.58, -0.3),
      new THREE.Vector3(0.45, -0.5, -0.55),
      new THREE.Vector3(0.65, -0.2, -0.95),
    ]),
  ];

  const vesselGroup = new THREE.Group();
  const vesselMat = new THREE.MeshStandardMaterial({
    color: 0xef4444, // arterial red
    roughness: 0.3,
    metalness: 0.4,
    emissive: 0xb91c1c,
    emissiveIntensity: 0.45,
  });

  vesselCurves.forEach((curve) => {
    const tubeGeo = new THREE.TubeGeometry(curve, 28, 0.032, 10, false);
    const tubeMesh = new THREE.Mesh(tubeGeo, vesselMat);
    vesselGroup.add(tubeMesh);
  });

  // Flowing blood particles
  const particleCount = 120;
  const bloodPositions = new Float32Array(particleCount * 3);
  const bloodProgress = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    bloodProgress[i] = Math.random();
    const curve = vesselCurves[i % vesselCurves.length];
    const pt = curve.getPoint(bloodProgress[i]);
    bloodPositions[i * 3] = pt.x;
    bloodPositions[i * 3 + 1] = pt.y;
    bloodPositions[i * 3 + 2] = pt.z;
  }

  const bloodGeo = new THREE.BufferGeometry();
  bloodGeo.setAttribute('position', new THREE.BufferAttribute(bloodPositions, 3));
  (bloodGeo as any).userData = { progress: bloodProgress, curves: vesselCurves };

  const bloodMat = new THREE.PointsMaterial({
    color: 0xff6b6b,
    size: 0.055,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
  });
  const bloodPoints = new THREE.Points(bloodGeo, bloodMat);

  return { vessels: vesselGroup, bloodPoints };
}
