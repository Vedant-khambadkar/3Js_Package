import { Canvas } from '@react-three/fiber';
import { Environment, Float, OrbitControls } from '@react-three/drei';
import { Book } from './book';
import { samplePages } from './book/bookPages';

export default function App() {

  return (
    <>
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
          />
        </Float>
      </Canvas>
    </>

  )
}
