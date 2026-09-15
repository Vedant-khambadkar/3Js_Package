# r3f-motion-kit

🎨 **Production-ready 3D components and interactive animations for React Three Fiber and Three.js.**

Lightweight · TypeScript · Customizable · WebGL · GLSL Shaders · React Three Fiber

[![npm version](https://img.shields.io/npm/v/@vedant-khambadkar/r3f-motion-kit.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/@vedant-khambadkar/r3f-motion-kit)
[![npm downloads](https://img.shields.io/npm/dm/@vedant-khambadkar/r3f-motion-kit.svg?style=flat-square&color=emerald)](https://www.npmjs.com/package/@vedant-khambadkar/r3f-motion-kit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6.svg?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

---

## 🔗 Links

- 📦 **NPM Package**: [https://www.npmjs.com/package/@vedant-khambadkar/r3f-motion-kit](https://www.npmjs.com/package/@vedant-khambadkar/r3f-motion-kit)
- 🐙 **GitHub Repository**: [https://github.com/Vedant-khambadkar/3Js_Package](https://github.com/Vedant-khambadkar/3Js_Package)

---

## ✨ Features

- ⚡ **Particle Loader (`<ParticleLoader />`)**: High-performance GLSL fragment shader pixel-grid transition & screen preloader with customizable pixel sizes, color palettes, staggered random fading, and GSAP easing.
- 📖 **Interactive 3D Book (`<Book />`)**: Procedurally skinned page meshes with bone-based bending curvature and realistic paper physics.
- 🦴 **Procedural Skeletal Deformation**: Multi-bone hierarchical chains providing smooth, natural page folding and arching.
- 🎬 **Smooth Turn Physics**: Interpolated angle damping with configurable S-curves, arching, and duration.
- 🎨 **Flexible Page Textures & Colors**: Seamlessly supports image URLs and CSS color strings (hex, rgb, hsl, named colors).
- 🎛️ **Dual Control Modes**: Use controlled React state or uncontrolled imperative ref controls.
- 🕹️ **Imperative Ref API**: Full programmatic navigation via `BookRef` (`next()`, `previous()`, `goToPage()`, `firstPage()`, `lastPage()`).
- ⚡ **GPU Geometry Caching**: Automatic caching of segmented `BoxGeometry` to prevent memory leaks and GPU buffer redundancy.
- 📘 **TypeScript-First**: 100% type-safe interfaces for props, shader uniforms, materials, animation physics, and refs.

---

## 🎥 Visual Preview

<!-- Demo Video & Animation Preview -->
<div align="center">
  <video src="https://github.com/user-attachments/assets/demo.mp4" controls="controls" muted="muted" style="max-width: 100%; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);" poster="https://raw.githubusercontent.com/Vedant-khambadkar/3Js_Package/main/assets/preview.png">
    Your browser does not support the video tag.
  </video>
  <p><em>Interactive 3D Book & GLSL Particle Grid Transition Preloader</em></p>
</div>

---

## 📦 Installation

Install `@vedant-khambadkar/r3f-motion-kit` along with its required peer dependencies:

### npm

```bash
npm install @vedant-khambadkar/r3f-motion-kit three @react-three/fiber @react-three/drei gsap
```

### yarn

```bash
yarn add @vedant-khambadkar/r3f-motion-kit three @react-three/fiber @react-three/drei gsap
```

### pnpm

```bash
pnpm add @vedant-khambadkar/r3f-motion-kit three @react-three/fiber @react-three/drei gsap
```

### bun

```bash
bun add @vedant-khambadkar/r3f-motion-kit three @react-three/fiber @react-three/drei gsap
```

> **Peer Dependencies Note**: `react` (>=18), `react-dom` (>=18), `three` (>=0.156.0), `@react-three/fiber` (^8.0.0 || ^9.0.0), and `gsap` (^3.12.0) are supported.

---

## 🚀 Components Quick Start

---

### 1. Particle Loader (`<ParticleLoader />`)

A sleek, GPU-accelerated GLSL pixel grid overlay that dissolves randomly to reveal your 3D scene or page content. Perfect for initial page loads, route transitions, and 3D asset loaders.

#### Basic Usage

```tsx
import { useState } from 'react';
import { ParticleLoader } from '@vedant-khambadkar/r3f-motion-kit';

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <main>
      {loading && (
        <ParticleLoader
          onComplete={() => {
            console.log('Transition finished!');
            setLoading(false);
          }}
        />
      )}

      {/* Your 3D Canvas / Page Content */}
      <div className="content">
        <h1>Welcome to My 3D App</h1>
      </div>
    </main>
  );
}
```

#### Customized Colors, Box Size & GSAP Easing

```tsx
import { ParticleLoader } from '@vedant-khambadkar/r3f-motion-kit';

export function CyberpunkLoader() {
  return (
    <ParticleLoader
      color="#00f0ff"             // Neon Cyan pixel color
      backgroundColor="#090a0f"   // Dark futuristic overlay background
      boxSize={40}                // Smaller high-density grid pixels (default: 65)
      duration={1.8}              // Animation duration in seconds (default: 2.2)
      delay={0.4}                 // Delay before fading starts (default: 0.6)
      ease="power3.inOut"         // GSAP easing
      fadeDuration={0.35}         // Staggered cell fade window
      onComplete={() => console.log('Scene revealed')}
    />
  );
}
```

#### External Progress Control (Asset Loading)

You can bypass the auto-play GSAP tween and manually drive the dissolution with an asset loading percentage:

```tsx
import { useProgress } from '@react-three/drei';
import { ParticleLoader } from '@vedant-khambadkar/r3f-motion-kit';

export function AssetLoadingScreen() {
  const { progress } = useProgress(); // 0 to 100 from Drei

  return (
    <ParticleLoader
      progress={progress / 100} // normalized 0.0 -> 1.0
      color="#484747"
      backgroundColor="#111111"
    >
      {/* Optional overlay children */}
      <div style={{ position: 'absolute', bottom: 40, width: '100%', textAlign: 'center', color: '#fff' }}>
        Loading assets: {Math.round(progress)}%
      </div>
    </ParticleLoader>
  );
}
```

---

### 2. Interactive 3D Book (`<Book />`)

A complete, photorealistic 3D book with realistic skeletal page bending, turning curvature, and pointer interaction.

```tsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Book } from '@vedant-khambadkar/r3f-motion-kit';

const samplePages = [
  { front: '#ef4444', back: '#f97316' }, // Cover Page
  { front: '#f59e0b', back: '#10b981' }, // Page 1
  { front: '#06b6d4', back: '#3b82f6' }, // Page 2
  { front: '#6366f1', back: '#8b5cf6' }, // Page 3
  { front: '#ec4899', back: '#f43f5e' }, // Back Cover
];

export default function BookApp() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 1.5, 4.5], fov: 45 }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[4, 6, 4]} intensity={2.0} castShadow />
        <OrbitControls makeDefault />

        <Book
          pages={samplePages}
          position={[0, 0, 0]}
          scale={1.2}
        />
      </Canvas>
    </div>
  );
}
```

---

## 💡 Advanced Book Usage Examples

### 1. Image Textures & Semantic Page Types

Pass image URLs to `front` and `back` properties and designate cover pages:

```tsx
import { Canvas } from '@react-three/fiber';
import { Book, type BookPage } from '@vedant-khambadkar/r3f-motion-kit';

const bookPages: BookPage[] = [
  {
    front: '/textures/cover-front.jpg',
    back: '/textures/cover-inside-front.jpg',
    type: 'cover',
  },
  {
    front: '/textures/page-1.jpg',
    back: '/textures/page-2.jpg',
  },
  {
    front: '/textures/cover-inside-back.jpg',
    back: '/textures/cover-back.jpg',
    type: 'back-cover',
  },
];

export function TexturedBook() {
  return (
    <Canvas camera={{ position: [0, 2, 5], fov: 45 }}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 5, 3]} intensity={1.8} />

      <Book pages={bookPages} scale={1.2} />
    </Canvas>
  );
}
```

---

### 2. Controlled State (`currentPage` & `onPageChange`)

Synchronize the 3D Book with external React UI controls:

```tsx
import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Book } from '@vedant-khambadkar/r3f-motion-kit';

const pages = [
  { front: '#1e293b', back: '#334155' },
  { front: '#3b82f6', back: '#60a5fa' },
  { front: '#10b981', back: '#34d399' },
  { front: '#0f172a', back: '#1e293b' },
];

export function ControlledBookExample() {
  const [currentPage, setCurrentPage] = useState(0);

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, display: 'flex', gap: 8 }}>
        <button onClick={() => setCurrentPage((p) => Math.max(0, p - 1))} disabled={currentPage === 0}>
          Previous
        </button>
        <span style={{ color: '#fff' }}>Page {currentPage} / {pages.length}</span>
        <button onClick={() => setCurrentPage((p) => Math.min(pages.length, p + 1))} disabled={currentPage === pages.length}>
          Next
        </button>
      </div>

      <Canvas camera={{ position: [0, 1.8, 4.8], fov: 45 }}>
        <ambientLight intensity={1.0} />
        <directionalLight position={[5, 8, 5]} intensity={2.0} />

        <Book
          pages={pages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          scale={1.2}
        />
      </Canvas>
    </div>
  );
}
```

---

### 3. Imperative Navigation via `BookRef`

```tsx
import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Book, type BookRef } from '@vedant-khambadkar/r3f-motion-kit';

export function ImperativeBookExample() {
  const bookRef = useRef<BookRef>(null);

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, margin: 16 }}>
        <button onClick={() => bookRef.current?.firstPage()}>First Page</button>
        <button onClick={() => bookRef.current?.previous()}>Previous</button>
        <button onClick={() => bookRef.current?.next()}>Next</button>
        <button onClick={() => bookRef.current?.lastPage()}>Last Page</button>
        <button onClick={() => bookRef.current?.goToPage(2)}>Jump to Page 2</button>
      </div>

      <Canvas camera={{ position: [0, 2, 5], fov: 45 }}>
        <ambientLight intensity={1.0} />
        <directionalLight position={[4, 6, 4]} intensity={2.0} />
        <Book ref={bookRef} pages={[{ front: '#ef4444', back: '#f97316' }]} />
      </Canvas>
    </div>
  );
}
```

---

## 📖 API Reference

### `<ParticleLoader />` Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `color` / `boxColor` | `THREE.ColorRepresentation` | `"#484747"` | Color of the pixel grid boxes (hex, rgb, hsl, or named color). |
| `backgroundColor` | `string` | `"transparent"` | CSS background color for the overlay container. |
| `boxSize` / `uBoxSize` / `pixelSize` | `number` | `65.0` | Size of each grid pixel in CSS pixels. |
| `duration` | `number` | `2.2` | Fade-out animation duration in seconds. |
| `delay` | `number` | `0.6` | Delay before fading begins in seconds. |
| `ease` | `string` | `"power2.inOut"` | GSAP easing function or curve name. |
| `fadeDuration` | `number` | `0.28` | Relative duration window per individual cell fade (`0.01` to `1.0`). |
| `onComplete` | `() => void` | `undefined` | Callback fired when the transition finishes. |
| `autoPlay` | `boolean` | `true` | Whether to automatically play the GSAP animation on mount. |
| `progress` | `number` | `undefined` | Controlled progress value (`0.0` = visible, `1.0` = dissolved). |
| `reverse` | `boolean` | `false` | Animate in reverse (from transparent to visible). |
| `dpr` | `number \| [number, number]` | `devicePixelRatio` | Device Pixel Ratio for the Canvas. |
| `zIndex` | `number` | `50` | Z-index for the overlay container. |
| `className` | `string` | `"fixed inset-0..."` | Custom CSS class name for the wrapper. |
| `style` | `CSSProperties` | `undefined` | Custom inline styles for the wrapper. |
| `children` | `ReactNode` | `undefined` | Optional overlay elements (e.g., text, spinners, logo). |

---

### `<Book />` Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `pages` | `BookPage[]` | *Required* | Array of page definitions (textures or colors). |
| `currentPage` | `number` | `undefined` | Controlled active page index (`0` to `pages.length`). |
| `defaultPage` | `number` | `0` | Initial page index when in uncontrolled mode. |
| `onPageChange` | `(page: number) => void` | `undefined` | Callback fired when the active page index changes. |
| `onPageTurnStart` | `(page: number) => void` | `undefined` | Callback fired when a page begins turning. |
| `onPageTurnComplete` | `(page: number) => void` | `undefined` | Callback fired when a page turn finishes. |
| `onPageClick` | `(page: number) => void` | `undefined` | Callback fired when any page is clicked. |
| `onPageHover` | `(page: number \| null) => void` | `undefined` | Callback fired when a page is hovered. |
| `enableInteraction` | `boolean` | `true` | Enables pointer click flips and hover glow highlights. |
| `pageWidth` | `number` | `1.28` | Physical width of each page leaf in 3D units. |
| `pageHeight` | `number` | `1.71` | Physical height of each page leaf in 3D units. |
| `pageDepth` | `number` | `0.003` | Thickness/depth of each page leaf in 3D units. |
| `pageSegments` | `number` | `30` | Horizontal subdivisions for bone curvature bending. |
| `pageMaterial` | `BookMaterialOptions` | `undefined` | Surface material settings for inner pages. |
| `coverMaterial` | `BookMaterialOptions` | `undefined` | Surface material settings for front & back covers. |
| `animation` | `BookAnimationOptions` | `undefined` | Physics damping and curve curvature tuning options. |
| `position` | `[x, y, z]` | `undefined` | Three.js group position. |
| `rotation` | `[x, y, z]` | `undefined` | Three.js group rotation. |
| `scale` | `number \| [x, y, z]` | `undefined` | Three.js group scale. |

---

### `BookRef` Methods

| Method | Signature | Description |
| :--- | :--- | :--- |
| `next()` | `() => void` | Turns forward to the next page. |
| `previous()` | `() => void` | Turns backward to the previous page. |
| `goToPage(page)` | `(page: number) => void` | Steps smoothly to the specified target page. |
| `firstPage()` | `() => void` | Jumps/turns to the front cover (page `0`). |
| `lastPage()` | `() => void` | Jumps/turns to the back cover (page `N`). |
| `getCurrentPage()` | `() => number` | Returns the currently active page index. |
| `getTotalPages()` | `() => number` | Returns the total number of pages in the book. |

---

## 🔧 Modular Exports & Subpaths

```ts
// Main package entrypoint
import {
  // Book Component & Types
  Book,
  DEFAULT_BOOK_OPTIONS,
  type BookPage,
  type BookProps,
  type BookRef,
  type BookMaterialOptions,
  type BookAnimationOptions,

  // Particle Loader Component & Types
  ParticleLoader,
  Particle_Loader,
  DEFAULT_PARTICLE_LOADER_OPTIONS,
  type ParticleLoaderProps,
} from '@vedant-khambadkar/r3f-motion-kit';

// Subpath imports
import { Book } from '@vedant-khambadkar/r3f-motion-kit/book';
import { ParticleLoader } from '@vedant-khambadkar/r3f-motion-kit/loader';
```

---

## ⚡ Performance Best Practices

1. **GPU Shader Transitions**: `<ParticleLoader />` runs entirely on the GPU via custom GLSL shaders with zero DOM layout thrashing and automatic resolution scaling.
2. **Geometry Buffer Caching**: The segmented `BoxGeometry` is automatically cached via `getOrCreatePageGeometry` based on dimensions and segment count. Multiple pages and book instances share the underlying GPU buffer geometry.
3. **Animation Loop Optimization**: Bone rotations and materials are updated inside `useFrame` using damped angle math (`maath.easing.dampAngle`) to prevent memory allocations or garbage collection stutter.
4. **Adaptive Segments**: For mobile or lower-power devices, set `pageSegments={20}`. For high-end desktop presentations, `pageSegments={30}` or `32` delivers photorealistic paper bending.

---

## 🧪 Testing

The library includes automated test suites covering math utilities, bone rotation computations, bounds clamping, shader options, and loader exports:

```bash
npm test
```

---

## 📄 License

MIT © [Vedant Khambadkar](https://github.com/Vedant-khambadkar)