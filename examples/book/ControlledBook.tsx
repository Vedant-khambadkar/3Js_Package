import { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Book, type BookRef } from '../../src';

const samplePages = [
  { front: '#1e293b', back: '#334155' }, // Slate Cover
  { front: '#3b82f6', back: '#60a5fa' }, // Blue
  { front: '#10b981', back: '#34d399' }, // Emerald
  { front: '#f59e0b', back: '#fbbf24' }, // Amber
  { front: '#0f172a', back: '#1e293b' }, // Dark Back Cover
];

export function ControlledBookExample() {
  const [currentPage, setCurrentPage] = useState(0);
  const bookRef = useRef<BookRef>(null);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* External Application UI Controls */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          gap: '8px',
          background: 'rgba(15, 23, 42, 0.75)',
          padding: '8px 16px',
          borderRadius: '30px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <button
          onClick={() => bookRef.current?.firstPage()}
          style={btnStyle}
        >
          First
        </button>
        <button
          onClick={() => bookRef.current?.previous()}
          disabled={currentPage === 0}
          style={btnStyle}
        >
          Prev
        </button>
        <span style={{ color: '#fff', alignSelf: 'center', margin: '0 8px', fontSize: '14px' }}>
          Page {currentPage} of {samplePages.length}
        </span>
        <button
          onClick={() => bookRef.current?.next()}
          disabled={currentPage === samplePages.length}
          style={btnStyle}
        >
          Next
        </button>
        <button
          onClick={() => bookRef.current?.lastPage()}
          style={btnStyle}
        >
          Last
        </button>
      </div>

      <Canvas camera={{ position: [0, 1.8, 4.8], fov: 45 }}>
        <ambientLight intensity={1.0} />
        <directionalLight position={[5, 8, 5]} intensity={2.2} />

        <Book
          ref={bookRef}
          pages={samplePages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          scale={1.2}
        />
      </Canvas>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.15)',
  color: '#fff',
  border: 'none',
  padding: '6px 14px',
  borderRadius: '20px',
  cursor: 'pointer',
  fontSize: '13px',
};
