import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Book } from '../../src';

const samplePages = [
  { front: '#4338ca', back: '#6366f1' },
  { front: '#0284c7', back: '#38bdf8' },
  { front: '#059669', back: '#34d399' },
  { front: '#d97706', back: '#fbbf24' },
  { front: '#dc2626', back: '#f87171' },
];

export function BookWithOrbitControlsExample() {
  return (
    <Canvas camera={{ position: [0, 2.5, 5], fov: 45 }}>
      {/* Application owns OrbitControls */}
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.05}
        minDistance={2}
        maxDistance={10}
      />

      <ambientLight intensity={1.0} />
      <directionalLight position={[4, 6, 4]} intensity={2.0} />

      <Book
        pages={samplePages}
        scale={1.3}
        position={[0, -0.2, 0]}
      />
    </Canvas>
  );
}
