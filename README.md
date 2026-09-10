# r3f-motion-kit

🎨 **Production-ready 3D components and interactive animations for React Three Fiber and Three.js.**

Lightweight · TypeScript · Customizable · WebGL · React Three Fiber

[![npm version](https://img.shields.io/npm/v/@vedant-khambadkar/r3f-motion-kit.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/@vedant-khambadkar/r3f-motion-kit)
[![npm downloads](https://img.shields.io/npm/dm/@vedant-khambadkar/r3f-motion-kit.svg?style=flat-square&color=emerald)](https://www.npmjs.com/package/@vedant-khambadkar/r3f-motion-kit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6.svg?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

---

## 🔗 Links

- 📦 **NPM Package**: [https://www.npmjs.com/package/@vedant-khambadkar/r3f-motion-kit](https://www.npmjs.com/package/@vedant-khambadkar/r3f-motion-kit)
- 🐙 **GitHub Repository**: [https://github.com/Vedant-khambadkar/3Js_Package](https://github.com/Vedant-khambadkar/3Js_Package)

---

## ✨ Why r3f-motion-kit?

Building interactive 3D elements in Three.js and React Three Fiber often requires wrestling with complex low-level mechanics: skeletal skinning, multi-bone chains, vertex weights, curvature math, texture loaders, and smooth angle interpolation.

**r3f-motion-kit** provides modular, production-ready 3D components designed specifically for React Three Fiber. The library encapsulates bone skinning and procedural motion under clean, declarative React components while keeping your application in complete control of the canvas, lighting, camera, and surrounding scene.

---

## 🚀 Features

- 📖 **Interactive 3D Book**: Procedurally skinned page meshes with bone-based bending curvature.
- 🦴 **Procedural Skeletal Deformation**: Multi-bone hierarchical chains providing smooth, natural page folding.
- 🎬 **Smooth Turn Physics**: Interpolated angle damping with configurable S-curve, arching, and duration.
- 🎨 **Flexible Page Textures & Colors**: Seamlessly supports image URLs and CSS color strings (hex, rgb, hsl, named colors).
- 🎛️ **Dual Control Modes**: Use controlled React state (`currentPage`, `onPageChange`) or uncontrolled imperative ref controls.
- 🕹️ **Imperative Ref API**: Full navigation via `BookRef` (`next()`, `previous()`, `goToPage()`, `firstPage()`, `lastPage()`).
- ⚡ **Shared Geometry Caching**: Automatic caching of segmented `BoxGeometry` to prevent GPU buffer redundancy and memory leaks.
- 📘 **TypeScript-First**: Complete type safety with exported interfaces for props, materials, animation settings, and ref handles.
- 📐 **Strict Separation of Concerns**: You control `<Canvas>`, cameras, and lights; the component handles 3D presentation and interaction.

---

## 📦 Installation

Install `@vedant-khambadkar/r3f-motion-kit` along with its required peer dependencies:

### npm

```bash
npm install @vedant-khambadkar/r3f-motion-kit three @react-three/fiber @react-three/drei
```

### yarn

```bash
yarn add @vedant-khambadkar/r3f-motion-kit three @react-three/fiber @react-three/drei
```

### pnpm

```bash
pnpm add @vedant-khambadkar/r3f-motion-kit three @react-three/fiber @react-three/drei
```

### bun

```bash
bun add @vedant-khambadkar/r3f-motion-kit three @react-three/fiber @react-three/drei
```

> **Peer Dependencies Note**: `react` (>=18), `react-dom` (>=18), `three` (>=0.156.0), and `@react-three/fiber` (^8.0.0 || ^9.0.0) are peer dependencies.

---

## ⚡ Quick Start

Here is a minimal, ready-to-run interactive 3D Book example:

```tsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Book } from '@vedant-khambadkar/r3f-motion-kit';

const samplePages = [
  { front: '#ef4444', back: '#f97316' }, // Page 0 (Front Cover)
  { front: '#f59e0b', back: '#10b981' }, // Page 1
  { front: '#06b6d4', back: '#3b82f6' }, // Page 2
  { front: '#6366f1', back: '#8b5cf6' }, // Page 3
  { front: '#ec4899', back: '#f43f5e' }, // Page 4 (Back Cover)
];

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 1.5, 4.5], fov: 45 }}>
        {/* Lights & Scene Controls owned by your application */}
        <ambientLight intensity={1.2} />
        <directionalLight position={[4, 6, 4]} intensity={2.0} castShadow />
        <OrbitControls makeDefault />

        {/* 3D Book Component */}
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

## 💡 Usage Examples

### 1. Image Textures & Semantic Page Types

Pass image URLs to `front` and `back` properties. Use `type` to semantically designate covers:

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
    front: '/textures/page-3.jpg',
    back: '/textures/page-4.jpg',
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

      <Book
        pages={bookPages}
        scale={1.2}
      />
    </Canvas>
  );
}
```

---

### 2. Controlled State (`currentPage` & `onPageChange`)

Synchronize the 3D Book with external React UI controls (buttons, pagination, step indicators):

```tsx
import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Book } from '@vedant-khambadkar/r3f-motion-kit';

const pages = [
  { front: '#1e293b', back: '#334155' },
  { front: '#3b82f6', back: '#60a5fa' },
  { front: '#10b981', back: '#34d399' },
  { front: '#f59e0b', back: '#fbbf24' },
  { front: '#0f172a', back: '#1e293b' },
];

export function ControlledBookExample() {
  const [currentPage, setCurrentPage] = useState(0);

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      {/* UI Navigation Overlay */}
      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, display: 'flex', gap: 8 }}>
        <button
          onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
          disabled={currentPage === 0}
        >
          Previous
        </button>
        <span style={{ color: '#fff' }}>Page {currentPage} / {pages.length}</span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(pages.length, p + 1))}
          disabled={currentPage === pages.length}
        >
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

### 3. Imperative Navigation via `ref`

Use `BookRef` to trigger navigation imperatively from outside the canvas:

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

        <Book
          ref={bookRef}
          pages={[
            { front: '#ef4444', back: '#f97316' },
            { front: '#f59e0b', back: '#10b981' },
            { front: '#06b6d4', back: '#3b82f6' },
            { front: '#6366f1', back: '#8b5cf6' },
          ]}
        />
      </Canvas>
    </div>
  );
}
```

---

### 4. Custom Materials, Geometry & Bending Physics

Fine-tune physical dimensions, mesh smoothness, roughness, metalness, and bone bending curve constants:

```tsx
import { Canvas } from '@react-three/fiber';
import { Book } from '@vedant-khambadkar/r3f-motion-kit';

export function CustomizedBookExample() {
  return (
    <Canvas camera={{ position: [0, 2.5, 5], fov: 45 }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[4, 8, 4]} intensity={2.2} castShadow />

      <Book
        pages={[
          { front: '#0f172a', back: '#1e293b' },
          { front: '#0284c7', back: '#38bdf8' },
          { front: '#0d9488', back: '#2dd4bf' },
          { front: '#1e293b', back: '#0f172a' },
        ]}
        // Physical Dimensions & Subdivision
        pageWidth={1.3}
        pageHeight={1.75}
        pageDepth={0.004}
        pageSegments={32}

        // Inner Page Surface Materials
        pageMaterial={{
          roughness: 0.2,
          metalness: 0.05,
          emissive: '#ffa500',
          highlightEmissiveIntensity: 0.25,
        }}

        // Distinct Cover Materials
        coverMaterial={{
          roughness: 0.7,
          metalness: 0.15,
        }}

        // Bending Physics & Damping Parameters
        animation={{
          pageTurnDuration: 450,       // Duration of page turn in ms
          easingFactor: 0.45,          // Rotation damping smoothing factor
          insideCurveStrength: 0.2,   // Bending curvature near spine
          outsideCurveStrength: 0.06,  // Flare curvature near outer edge
          turningCurveStrength: 0.1,   // Transition wave arc
        }}

        // Interaction callbacks
        onPageTurnStart={(page) => console.log('Turn started:', page)}
        onPageTurnComplete={(page) => console.log('Turn complete:', page)}
        onPageHover={(page) => console.log('Hovered page:', page)}
      />
    </Canvas>
  );
}
```

---

## 🏛️ Architecture & Scene Responsibility

`@vedant-khambadkar/r3f-motion-kit` follows a clean separation of scene concerns:

```text
                     YOUR APPLICATION
                            │
              ┌─────────────┼─────────────┐
              ↓             ↓             ↓
           <Canvas>   <OrbitControls>   <Lights>
              │             │             │
              └─────────────┼─────────────┘
                            ↓
                     <Book Component>
                            │
             ┌──────────────┼──────────────┐
             ↓              ↓              ↓
      Segmented Mesh    Bone Skeleton   useFrame Physics
             ↓              ↓              ↓
                    Three.js / WebGL
```

- **Application Owns**: `<Canvas>`, `<PerspectiveCamera>`, camera controls (`OrbitControls`), lighting setup, shadows, and surrounding UI state.
- **Component Owns**: Bone skeleton assembly, skinned vertex weights, angle damping calculations, material assignment, pointer events, and geometry caching.

---

## 📖 API Reference

### `<Book />` Props

`<Book />` accepts all standard React Three Fiber group properties (`position`, `rotation`, `scale`, etc.) in addition to the following component-specific props:

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `pages` | `BookPage[]` | *Required* | Array of page definitions (textures or colors). |
| `currentPage` | `number` | `undefined` | Controlled active page index (`0` to `pages.length`). |
| `defaultPage` | `number` | `0` | Initial page index when in uncontrolled mode. |
| `onPageChange` | `(page: number) => void` | `undefined` | Callback fired when the active page index changes. |
| `onPageTurnStart` | `(page: number) => void` | `undefined` | Callback fired when a page begins its turn animation. |
| `onPageTurnComplete` | `(page: number) => void` | `undefined` | Callback fired when a page turn animation finishes. |
| `onPageClick` | `(page: number) => void` | `undefined` | Callback fired when any page is clicked. |
| `onPageHover` | `(page: number \| null) => void` | `undefined` | Callback fired when a page is hovered or unhovered. |
| `enableInteraction` | `boolean` | `true` | Enables pointer click flips and hover glow highlights. |
| `pageWidth` | `number` | `1.28` | Physical width of each page leaf in 3D world units. |
| `pageHeight` | `number` | `1.71` | Physical height of each page leaf in 3D world units. |
| `pageDepth` | `number` | `0.003` | Thickness/depth of each page leaf in 3D world units. |
| `pageSegments` | `number` | `30` | Horizontal subdivisions for bone curvature bending. |
| `pageMaterial` | `BookMaterialOptions` | `undefined` | Surface material settings for inner pages. |
| `coverMaterial` | `BookMaterialOptions` | `undefined` | Surface material settings for front & back covers. |
| `animation` | `BookAnimationOptions` | `undefined` | Physics damping and curve curvature tuning options. |
| `position` | `[x, y, z]` | `undefined` | Three.js group position. |
| `rotation` | `[x, y, z]` | `undefined` | Three.js group rotation. |
| `scale` | `number \| [x, y, z]` | `undefined` | Three.js group scale. |

---

### `BookRef` Methods

Access these methods by attaching a `ref` (`useRef<BookRef>(null)`) to `<Book />`:

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

### Type Definitions

#### `BookPage`

```ts
export interface BookPage {
  /** Front face image texture URL or CSS color string (e.g. '#3b82f6', 'rgb(...)') */
  front: string;

  /** Back face image texture URL or CSS color string */
  back: string;

  /** Optional roughness map URL for the front face */
  frontRoughness?: string;

  /** Optional roughness map URL for the back face */
  backRoughness?: string;

  /** Semantic page type ('cover' | 'page' | 'back-cover') */
  type?: 'cover' | 'page' | 'back-cover';
}
```

#### `BookMaterialOptions`

```ts
export interface BookMaterialOptions {
  /** Base tint color applied to the page surface (Default: "#ffffff") */
  color?: string | Color;

  /** Surface roughness factor from 0.0 to 1.0 (Default: 0.1 for inner pages, 0.8 for covers) */
  roughness?: number;

  /** Surface metalness factor from 0.0 to 1.0 (Default: 0.0) */
  metalness?: number;

  /** Optional global roughness map texture */
  roughnessMap?: Texture | string;

  /** Glow emissive color on hover/highlight (Default: "orange") */
  emissive?: string | Color;

  /** Idle emissive intensity (Default: 0.0) */
  emissiveIntensity?: number;

  /** Emissive intensity when hovered (Default: 0.22) */
  highlightEmissiveIntensity?: number;
}
```

#### `BookAnimationOptions`

```ts
export interface BookAnimationOptions {
  /** Total page turn transition duration in milliseconds (Default: 400) */
  pageTurnDuration?: number;

  /** Bone rotation damping smoothing factor (Default: 0.5) */
  easingFactor?: number;

  /** Secondary fold easing factor (Default: 0.2) */
  easingFactorFold?: number;

  /** Curvature bending strength near the spine (Default: 0.18) */
  insideCurveStrength?: number;

  /** Flare curvature strength near the outer edge (Default: 0.05) */
  outsideCurveStrength?: number;

  /** Wave arching strength during mid-turn transition (Default: 0.09) */
  turningCurveStrength?: number;
}
```

---

## 🔧 Modular Exports & Subpaths

You can import components and math utilities from the package root or directly from the `./book` subpath:

```ts
// Root entrypoint
import {
  Book,
  DEFAULT_BOOK_OPTIONS,
  getOrCreatePageGeometry,
  createPageSkeleton,
  calculateBoneRotation,
  clampPage,
  type BookPage,
  type BookProps,
  type BookRef,
  type BookMaterialOptions,
  type BookAnimationOptions,
} from '@vedant-khambadkar/r3f-motion-kit';

// Subpath entrypoint
import { Book } from '@vedant-khambadkar/r3f-motion-kit/book';
```

---

## ⚡ Performance Best Practices

1. **Geometry Buffer Caching**: The segmented `BoxGeometry` is automatically cached via `getOrCreatePageGeometry` based on dimensions and segment count. Multiple pages and book instances share the underlying GPU buffer geometry.
2. **Animation Loop Optimization**: Bone rotations and materials are updated inside `useFrame` using damped angle math (`maath.easing.dampAngle`) to prevent memory allocations or garbage collection stutter.
3. **Adaptive Segments**: For mobile or lower-power devices, set `pageSegments={20}`. For high-end desktop presentations requiring ultra-fine curvature, `pageSegments={30}` or `32` delivers photorealistic paper bending.

---

## 🧪 Testing

The library includes test suites covering math utilities, bone rotation computations, bounds clamping, and navigation logic:

```bash
npm test
```

---

## 📄 License

MIT © [Vedant Khambadkar](https://github.com/Vedant-khambadkar)