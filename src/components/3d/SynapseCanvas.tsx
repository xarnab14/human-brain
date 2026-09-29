import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface SynapseCanvasProps {
  neurotransmitterType: 'dopamine' | 'serotonin' | 'glutamate' | 'gaba';
  firingRate: number; // 1 to 10
  actionPotentialTriggered: boolean;
  onActionPotentialComplete?: () => void;
  reducedMotion: boolean;
}

export const SynapseCanvas: React.FC<SynapseCanvasProps> = ({
  neurotransmitterType,
  firingRate,
  actionPotentialTriggered,
  onActionPotentialComplete,
  reducedMotion,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // Synaptic elements
  const axonPulseRef = useRef<THREE.Mesh | null>(null);
  const vesiclesRef = useRef<THREE.Mesh[]>([]);
  const freeMoleculesRef = useRef<THREE.Points | null>(null);
  const postsynapticWaveRef = useRef<THREE.Mesh | null>(null);

  // Action potential animation state
  const apProgressRef = useRef<number>(-1); // -1 = idle, 0 to 1 = active wave
  const neurotransmitterColors = {
    dopamine: 0x38bdf8,   // electric cyan
    serotonin: 0xa855f7,  // violet
    glutamate: 0x10b981,  // emerald
    gaba: 0xf59e0b,       // amber
  };

  // Trigger pulse effect
  useEffect(() => {
    if (actionPotentialTriggered) {
      apProgressRef.current = 0;
    }
  }, [actionPotentialTriggered]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070c, 0.05);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 0.3, 5.0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambient = new THREE.AmbientLight(0x0f1c3f, 1.4);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xe0f2fe, 2.5);
    dirLight.position.set(2, 4, 3);
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0x06b6d4, 3.0);
    rimLight.position.set(-2, -3, -3);
    scene.add(rimLight);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // ==========================================
    // 1. PRESYNAPTIC AXON TERMINAL (BOUTON)
    // ==========================================
    // Top terminal bulb
    const boutonGeo = new THREE.SphereGeometry(1.2, 32, 28);
    boutonGeo.scale(1.2, 0.9, 0.8);
    const boutonMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e293b,
      roughness: 0.4,
      metalness: 0.15,
      transparent: true,
      opacity: 0.75,
      clearcoat: 0.3,
      emissive: 0x0f172a,
    });
    const boutonMesh = new THREE.Mesh(boutonGeo, boutonMat);
    boutonMesh.position.set(0, 1.15, 0);
    rootGroup.add(boutonMesh);

    // Axon shaft entering from top
    const axonGeo = new THREE.CylinderGeometry(0.25, 0.28, 2.2, 24);
    const axonMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a5f,
      roughness: 0.4,
      metalness: 0.2,
      emissive: 0x0c4a6e,
      emissiveIntensity: 0.2,
    });
    const axonMesh = new THREE.Mesh(axonGeo, axonMat);
    axonMesh.position.set(0, 2.3, 0);
    rootGroup.add(axonMesh);

    // Action potential glowing pulse ring on axon
    const apGeo = new THREE.TorusGeometry(0.32, 0.06, 16, 32);
    const apMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const apMesh = new THREE.Mesh(apGeo, apMat);
    apMesh.rotation.x = Math.PI / 2;
    apMesh.position.set(0, 3.2, 0);
    rootGroup.add(apMesh);
    axonPulseRef.current = apMesh;

    // Presynaptic vesicles (clusters inside bouton)
    const vesicleGeo = new THREE.SphereGeometry(0.085, 16, 16);
    const vesicleMat = new THREE.MeshStandardMaterial({
      color: neurotransmitterColors[neurotransmitterType],
      roughness: 0.25,
      emissive: neurotransmitterColors[neurotransmitterType],
      emissiveIntensity: 0.6,
    });

    const vesicleMeshes: THREE.Mesh[] = [];
    const vesicleCount = 28;
    for (let i = 0; i < vesicleCount; i++) {
      const vMesh = new THREE.Mesh(vesicleGeo, vesicleMat.clone());
      // Cluster near bottom active zone of bouton
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 0.7;
      const vy = 0.55 + Math.random() * 0.65;
      vMesh.position.set(Math.cos(angle) * dist, vy, Math.sin(angle) * dist * 0.6);
      vMesh.userData = {
        origY: vy,
        jitterSpeed: 1 + Math.random() * 2,
        jitterOffset: Math.random() * 10,
      };
      rootGroup.add(vMesh);
      vesicleMeshes.push(vMesh);
    }
    vesiclesRef.current = vesicleMeshes;

    // ==========================================
    // 2. SYNAPTIC CLEFT (20nm intercellular gap)
    // ==========================================
    // Free neurotransmitter molecules floating across the cleft
    const molCount = 140;
    const molCoords = new Float32Array(molCount * 3);
    const molProgress = new Float32Array(molCount);
    const molSpeeds = new Float32Array(molCount);

    for (let i = 0; i < molCount; i++) {
      molProgress[i] = Math.random();
      molSpeeds[i] = 0.3 + Math.random() * 0.7;
      molCoords[i * 3] = (Math.random() - 0.5) * 1.8;
      molCoords[i * 3 + 1] = 0.35 - molProgress[i] * 0.7; // between bouton (0.35) and spine (-0.35)
      molCoords[i * 3 + 2] = (Math.random() - 0.5) * 1.0;
    }

    const molGeo = new THREE.BufferGeometry();
    molGeo.setAttribute('position', new THREE.BufferAttribute(molCoords, 3));
    (molGeo as any).userData = { progress: molProgress, speeds: molSpeeds };

    const molMat = new THREE.PointsMaterial({
      color: neurotransmitterColors[neurotransmitterType],
      size: 0.055,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const molPoints = new THREE.Points(molGeo, molMat);
    rootGroup.add(molPoints);
    freeMoleculesRef.current = molPoints;

    // ==========================================
    // 3. POSTSYNAPTIC DENDRITIC SPINE MEMBRANE
    // ==========================================
    // Bottom membrane cup
    const spineGeo = new THREE.CylinderGeometry(1.6, 1.4, 0.45, 32);
    const spineMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e293b,
      roughness: 0.35,
      metalness: 0.15,
      clearcoat: 0.4,
      emissive: 0x0284c7,
      emissiveIntensity: 0.15,
    });
    const spineMesh = new THREE.Mesh(spineGeo, spineMat);
    spineMesh.position.set(0, -0.65, 0);
    rootGroup.add(spineMesh);

    // Postsynaptic density (PSD) & Receptors
    const receptorCount = 9;
    for (let i = 0; i < receptorCount; i++) {
      const rAngle = (i / receptorCount) * Math.PI * 2;
      const rDist = 0.4 + (i % 2) * 0.45;
      const recGeo = new THREE.CylinderGeometry(0.065, 0.08, 0.18, 12);
      const recMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.4,
        roughness: 0.2,
      });
      const recMesh = new THREE.Mesh(recGeo, recMat);
      recMesh.position.set(Math.cos(rAngle) * rDist, -0.4, Math.sin(rAngle) * rDist * 0.7);
      rootGroup.add(recMesh);
    }

    // Depolarization wave on postsynaptic membrane
    const waveGeo = new THREE.RingGeometry(0.1, 1.3, 32);
    const waveMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const waveMesh = new THREE.Mesh(waveGeo, waveMat);
    waveMesh.rotation.x = Math.PI / 2;
    waveMesh.position.set(0, -0.42, 0);
    rootGroup.add(waveMesh);
    postsynapticWaveRef.current = waveMesh;

    // Resize
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Gentle root slow drift
      if (!reducedMotion) {
        rootGroup.rotation.y = Math.sin(elapsed * 0.4) * 0.12;
      }

      // Vesicle micro-jitter
      vesicleMeshes.forEach((v) => {
        const u = v.userData;
        v.position.y = u.origY + Math.sin(elapsed * u.jitterSpeed + u.jitterOffset) * 0.02;
      });

      // Free molecules diffusion
      if (molPoints) {
        const coords = molPoints.geometry.attributes.position.array as Float32Array;
        const progress = (molPoints.geometry as any).userData.progress as Float32Array;
        const speeds = (molPoints.geometry as any).userData.speeds as Float32Array;
        const speedMultiplier = (firingRate / 5) * 0.4;

        for (let i = 0; i < molCount; i++) {
          progress[i] = (progress[i] + delta * speeds[i] * speedMultiplier) % 1.0;
          // Y moves from 0.35 to -0.38
          coords[i * 3 + 1] = 0.35 - progress[i] * 0.73;
          // Add subtle lateral brownian noise
          coords[i * 3] += Math.sin(elapsed * 2.0 + i) * 0.001;
        }
        molPoints.geometry.attributes.position.needsUpdate = true;
      }

      // Action Potential Wave Propagation
      if (apProgressRef.current >= 0) {
        apProgressRef.current += delta * 1.8;
        const p = apProgressRef.current;

        // Step 1: Axon spike (p: 0 to 0.4)
        if (axonPulseRef.current) {
          if (p <= 0.4) {
            const axonY = 3.2 - (p / 0.4) * 2.2;
            axonPulseRef.current.position.y = axonY;
            (axonPulseRef.current.material as THREE.MeshBasicMaterial).opacity = Math.sin((p / 0.4) * Math.PI) * 0.95;
          } else {
            (axonPulseRef.current.material as THREE.MeshBasicMaterial).opacity = 0;
          }
        }

        // Step 2: Bouton flash & vesicle discharge (p: 0.3 to 0.7)
        if (p >= 0.3 && p <= 0.7) {
          const intensity = Math.sin(((p - 0.3) / 0.4) * Math.PI);
          (boutonMesh.material as THREE.MeshPhysicalMaterial).emissiveIntensity = 0.2 + intensity * 0.8;
        } else {
          (boutonMesh.material as THREE.MeshPhysicalMaterial).emissiveIntensity = 0.2;
        }

        // Step 3: Postsynaptic receptor depolarization wave (p: 0.6 to 1.2)
        if (postsynapticWaveRef.current) {
          if (p >= 0.5 && p <= 1.2) {
            const waveT = (p - 0.5) / 0.7;
            postsynapticWaveRef.current.scale.set(1 + waveT * 0.8, 1 + waveT * 0.8, 1);
            (postsynapticWaveRef.current.material as THREE.MeshBasicMaterial).opacity = (1 - waveT) * 0.85;
          } else {
            (postsynapticWaveRef.current.material as THREE.MeshBasicMaterial).opacity = 0;
          }
        }

        if (p >= 1.2) {
          apProgressRef.current = -1;
          if (onActionPotentialComplete) {
            onActionPotentialComplete();
          }
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [neurotransmitterType, firingRate, reducedMotion]);

  return (
    <div ref={containerRef} className="relative w-full h-[480px] bg-slate-950/40 rounded-xl overflow-hidden border border-white/5 shadow-2xl">
      {/* 2D HUD Overlays for Microscopic Scale Anatomy */}
      <div className="absolute top-4 left-4 z-10 space-y-1">
        <div className="text-[11px] font-mono tracking-wider uppercase text-cyan-400">Microscopic Scale: 20nm Resolution</div>
        <div className="text-sm font-semibold text-slate-100 flex items-center gap-2">
          <span>Chemical Synapse Junction</span>
          <span className="text-xs text-slate-400 font-normal">· Axodendritic Terminal</span>
        </div>
      </div>

      {/* Floating Anatomical Labels */}
      <div className="absolute top-[28%] left-6 pointer-events-none text-xs text-slate-400 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></div>
        <span>Presynaptic Bouton (Axon Terminal)</span>
      </div>

      <div className="absolute top-[50%] right-6 pointer-events-none text-xs text-slate-400 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></div>
        <span>Synaptic Cleft (20nm gap & Neurotransmitter Diffusion)</span>
      </div>

      <div className="absolute bottom-[20%] left-6 pointer-events-none text-xs text-slate-400 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc]"></div>
        <span>Postsynaptic Density (Dendritic Spine & Receptors)</span>
      </div>
    </div>
  );
};
