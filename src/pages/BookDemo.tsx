import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Float, OrbitControls } from '@react-three/drei';
import { Book } from '../book';
import { samplePages } from './bookPages';

export function BookDemo() {
  const [page, setPage] = useState(0);
  const [copied, setCopied] = useState(false);

  const totalSpreads = samplePages.length;

  const handleCopy = () => {
    navigator.clipboard.writeText('npm install threejs-components');
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const getSpreadLabel = () => {
    if (page === 0) return 'Cover Page';
    if (page >= totalSpreads) return 'Back Cover';
    return `Pages ${page * 2 - 1} – ${page * 2}`;
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        background: '#070814',
      }}
    >
      {/* Dynamic Background Atmosphere */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        {/* Deep Radiant Nebula Glow Orbs */}
        <div
          className="animate-pulse-slow"
          style={{
            position: 'absolute',
            top: '15%',
            left: '25%',
            width: '650px',
            height: '650px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, rgba(56, 189, 248, 0.08) 45%, transparent 70%)',
            filter: 'blur(70px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '10%',
            right: '20%',
            width: '580px',
            height: '580px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.12) 0%, rgba(139, 92, 246, 0.06) 50%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />

        {/* Ambient Subtle Tech Grid Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
            opacity: 0.45,
            maskImage: 'radial-gradient(ellipse at 50% 50%, black 30%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 30%, transparent 80%)',
          }}
        />

        {/* Vignette border shadow */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(5, 6, 12, 0.8) 100%)',
          }}
        />
      </div>

      {/* Website Top Header Overlay */}
      <header
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          padding: '20px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pointerEvents: 'none',
        }}
      >
        {/* Brand Identity */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            pointerEvents: 'auto',
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px -4px rgba(99, 102, 241, 0.5)',
              fontSize: '19px',
            }}
          >
            📖
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px', fontWeight: 700, letterSpacing: '-0.02em', color: '#f8fafc' }}>
                threejs-components
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#38bdf8',
                  background: 'rgba(56, 189, 248, 0.12)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  padding: '2px 8px',
                  borderRadius: '12px',
                }}
              >
                v0.1.0
              </span>
            </div>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
              Interactive 3D Book for React Three Fiber
            </span>
          </div>
        </div>

        {/* Live Spread Indicator Badge */}
        <div
          className="glass-panel"
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '8px 18px',
            borderRadius: '30px',
          }}
        >
          <div
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: '#34d399',
              boxShadow: '0 0 10px #34d399',
            }}
          />
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0' }}>
            {getSpreadLabel()}
          </span>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            ({page} / {totalSpreads})
          </span>
        </div>

        {/* Quick Action: Copy NPM Package */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', pointerEvents: 'auto' }}>
          <button
            onClick={handleCopy}
            className="glass-pill"
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '20px',
              color: copied ? '#34d399' : '#f1f5f9',
              fontSize: '13px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 500,
              transition: 'all 0.25s ease',
              boxShadow: copied ? '0 0 16px rgba(52, 211, 153, 0.35)' : 'none',
            }}
          >
            <span>{copied ? '✓' : '$'}</span>
            <span>{copied ? 'Copied to clipboard!' : 'npm i threejs-components'}</span>
          </button>
        </div>
      </header>

      {/* Hero Narrative Overlay (Left Column) */}
      <div
        style={{
          position: 'absolute',
          top: '22%',
          left: '36px',
          zIndex: 15,
          maxWidth: '360px',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: '#a5b4fc',
            marginBottom: '16px',
          }}
        >
          <span>✦</span> REALTIME 3D SIMULATION
        </div>

        <h1
          style={{
            margin: '0 0 14px 0',
            fontSize: '38px',
            lineHeight: 1.15,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            background: 'linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Page-Turning Physics in Three.js
        </h1>

        <p
          style={{
            margin: '0 0 24px 0',
            fontSize: '14px',
            lineHeight: 1.6,
            color: '#94a3b8',
          }}
        >
          Segmented skeletal deformation, damped bone rotation hierarchies, and custom texture mapping encapsulated into a single clean component.
        </p>

        {/* Feature Badges */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div
            className="glass-panel"
            style={{
              padding: '10px 14px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <span style={{ fontSize: '18px' }}>🦴</span>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#f8fafc' }}>
                30-Bone Skeletal Spine
              </div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>
                Realtime S-curve bending calculations
              </div>
            </div>
          </div>

          <div
            className="glass-panel"
            style={{
              padding: '10px 14px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <span style={{ fontSize: '18px' }}>⚡</span>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#f8fafc' }}>
                Zero Three.js Overhead
              </div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>
                Tree-shakeable peer dependency bundle (~20 kB)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Instruction Dock */}
      <footer
        style={{
          position: 'absolute',
          bottom: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 20,
          pointerEvents: 'none',
        }}
      >
        <div
          className="glass-panel"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '10px 22px',
            borderRadius: '40px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
          }}
        >
          <span style={{ fontSize: '16px' }}>👆</span>
          <span style={{ fontSize: '13px', fontWeight: 500, color: '#e2e8f0' }}>
            Click on 3D book pages to turn • Drag to orbit camera • Scroll to zoom
          </span>
        </div>
      </footer>

      {/* 3D WebGL Canvas Layer */}
      <Canvas
        shadows
        camera={{ position: [-0.5, 1, 7], fov: 45 }}
        style={{ width: '100%', height: '100%', position: 'relative', zIndex: 10 }}
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
          <Book
            pages={samplePages}
            currentPage={page}
            onPageChange={setPage}
          />
        </Float>
      </Canvas>
    </div>
  );
}

export default BookDemo;
