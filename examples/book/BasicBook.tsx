import { Canvas } from '@react-three/fiber';
import { Book } from '../../src';

const samplePages = [
  { front: '#ef4444', back: '#f97316' }, // Red to Orange
  { front: '#f59e0b', back: '#10b981' }, // Amber to Emerald
  { front: '#06b6d4', back: '#3b82f6' }, // Cyan to Blue
  { front: '#6366f1', back: '#8b5cf6' }, // Indigo to Violet
  { front: '#ec4899', back: '#f43f5e' }, // Pink to Rose
];

export function BasicBookExample() {
  return (
    <Canvas camera={{ position: [0, 1.5, 4.5], fov: 45 }}>
      <ambientLight intensity={1.2} />
      <directionalLight position={[4, 6, 4]} intensity={2.0} castShadow />

      <Book
        pages={samplePages}
        position={[0, 0, 0]}
        scale={1.2}
      />
    </Canvas>
  );
}
