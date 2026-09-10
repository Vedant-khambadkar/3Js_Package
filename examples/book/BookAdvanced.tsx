import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import { Book } from '../../src';

const artPages = [
  { front: '#0f172a', back: '#1e293b', type: 'cover' as const },
  { front: '#0284c7', back: '#38bdf8' },
  { front: '#0d9488', back: '#2dd4bf' },
  { front: '#16a34a', back: '#4ade80' },
  { front: '#ca8a04', back: '#facc15' },
  { front: '#ea580c', back: '#fb923c' },
  { front: '#e11d48', back: '#fb7185' },
  { front: '#1e293b', back: '#0f172a', type: 'back-cover' as const },
];

export function BookAdvancedExample() {
  const [activePage, setActivePage] = useState(0);
  const [hoveredPage, setHoveredPage] = useState<number | null>(null);
  const [statusText, setStatusText] = useState('Idle');

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Telemetry overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          left: 24,
          zIndex: 10,
          background: 'rgba(15, 23, 42, 0.85)',
          color: '#e2e8f0',
          padding: '12px 20px',
          borderRadius: '12px',
          fontSize: '13px',
          fontFamily: 'monospace',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div>Current Page: <strong>{activePage}</strong> / {artPages.length}</div>
        <div>Hovered Page: <strong>{hoveredPage !== null ? hoveredPage : 'None'}</strong></div>
        <div>Status: <span style={{ color: '#38bdf8' }}>{statusText}</span></div>
      </div>

      <Canvas shadows camera={{ position: [0, 2.8, 5.5], fov: 42 }}>
        <OrbitControls makeDefault />

        <ambientLight intensity={0.8} />
        <directionalLight
          position={[4, 8, 4]}
          intensity={2.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        {/* Soft shadow receiver plane */}
        <mesh position={[0, -1.8, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <shadowMaterial transparent opacity={0.25} />
        </mesh>

        <Float
          speed={1.5}
          rotationIntensity={0.2}
          floatIntensity={0.5}
          floatingRange={[-0.1, 0.1]}
        >
          <Book
            pages={artPages}
            currentPage={activePage}
            onPageChange={setActivePage}
            onPageHover={setHoveredPage}
            onPageTurnStart={(p: number) => setStatusText(`Turning Page ${p}...`)}
            onPageTurnComplete={(p: number) => setStatusText(`Page ${p} Turn Complete`)}
            pageWidth={1.3}
            pageHeight={1.75}
            pageDepth={0.004}
            pageSegments={32}
            pageMaterial={{
              roughness: 0.2,
              metalness: 0.05,
              highlightEmissiveIntensity: 0.35,
            }}
            coverMaterial={{
              roughness: 0.7,
              metalness: 0.2,
            }}
            animation={{
              pageTurnDuration: 500,
              easingFactor: 0.45,
              insideCurveStrength: 0.2,
              outsideCurveStrength: 0.06,
              turningCurveStrength: 0.1,
            }}
            scale={1.3}
          />
        </Float>
      </Canvas>
    </div>
  );
}
