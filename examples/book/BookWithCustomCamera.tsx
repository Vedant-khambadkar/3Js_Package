import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { Book } from '../../src';

const samplePages = [
  { front: '#831843', back: '#9d174d' },
  { front: '#701a75', back: '#86198f' },
  { front: '#4c1d95', back: '#581c87' },
  { front: '#1e1b4b', back: '#312e81' },
];

export function BookWithCustomCameraExample() {
  return (
    <Canvas>
      {/* Application owns the Camera setup */}
      <PerspectiveCamera
        makeDefault
        position={[2, 3.5, 4]}
        fov={38}
      />

      <ambientLight intensity={1.1} />
      <directionalLight position={[6, 8, 3]} intensity={2.5} />

      <Book
        pages={samplePages}
        rotation={[0.2, -0.4, 0]}
        scale={1.2}
      />
    </Canvas>
  );
}
