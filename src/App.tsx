import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Float, OrbitControls } from '@react-three/drei';
import { Book } from './book';
import { samplePages } from './book/bookPages';
import { ParticleLoader } from './Loader';

export default function App() {
  const [loaderKey, setLoaderKey] = useState(0);
  const [showLoader, setShowLoader] = useState(true);

  const handleReplayLoader = () => {
    setShowLoader(true);
    setLoaderKey((prev) => prev + 1);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: '#0a0a0a' }}>
      {/* 3D Scene with Interactive Book */}
      <Canvas
        shadows
        camera={{ position: [-0.5, 1, 7], fov: 45 }}
        style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, zIndex: 1 }}
      >
        <OrbitControls enablePan={true} enableZoom={false} enableRotate={true} />
        <Environment preset="studio" />
        <directionalLight
          position={[2, 5, 2]}
          intensity={2.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />
        <mesh position-y={-2.5} rotation-x={-Math.PI / 2} receiveShadow>
          <planeGeometry args={[200, 100]} />
          <shadowMaterial transparent opacity={0.3} />
        </mesh>

        <Float
          rotation-x={-Math.PI / 4}
          floatIntensity={1}
          speed={2}
          rotationIntensity={2}
        >
          <Book pages={samplePages} />
        </Float>
      </Canvas>

      {/* Floating Control Panel */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          zIndex: 20,
          display: 'flex',
          gap: 10,
          background: 'rgba(20, 20, 25, 0.75)',
          backdropFilter: 'blur(10px)',
          padding: '10px 16px',
          borderRadius: 12,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        }}
      >
        <button
          onClick={handleReplayLoader}
          style={{
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            color: '#ffffff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: 8,
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '13px',
            transition: 'all 0.2s ease',
          }}
        >
          🔄 Replay Loader
        </button>
      </div>

      {/* Particle Transition Preloader */}
      {showLoader && (
        <ParticleLoader
          key={loaderKey}
          color="#222222"
          boxSize={60}
          duration={2.0}
          delay={0.4}
          ease="power2.inOut"
          zIndex={50}
          onComplete={() => {
            console.log('Loader transition completed!');
            setShowLoader(false);
          }}
        />
      )}
    </div>
  );
}
