# threejs-components

Production-ready, reusable interactive 3D components and animations for **Three.js** and **React Three Fiber** (R3F).

The library exposes clean, high-level declarative components that hide the underlying complexity of skeletal skinning, bone hierarchies, segmented geometries, physics damping, and shader/material management.

---

## Features

- 📖 **Interactive 3D Book**: Segmented page BoxGeometry with real bone skinning, bending curvature, and smooth turning physics.
- 🎛️ **Dual Control Modes**: Use controlled state (`currentPage`, `onPageChange`) or uncontrolled mode with full imperative ref control (`next()`, `previous()`, `goToPage()`).
- ⚡ **Zero Three.js Duplication**: Three.js and React Three Fiber are strictly peer dependencies; supports tree-shaking.
- 🎨 **Deep Customization**: Full control over page textures, front/back colors, roughness maps, cover settings, and bone bending curve constants.
- 📐 **Clean Responsibility Model**: You own your Camera, Lights, OrbitControls, and Canvas. The library provides only the 3D components.
- 🧱 **Extensible Architecture**: Modular structure designed for additional components such as 3D Keyboard, Particles, 3D Cards, and more.

---

## Installation

```bash
npm install threejs-components three @react-three/fiber @react-three/drei
```

> **Note**: `three`, `@react-three/fiber`, and `@react-three/drei` are peer dependencies. Ensure they are installed in your project.

---

## Quick Start

```tsx
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Book } from "threejs-components";

const pages = [
  { front: "/textures/cover.jpg", back: "/textures/page1.jpg" },
  { front: "/textures/page2.jpg", back: "/textures/page3.jpg" },
  { front: "/textures/page4.jpg", back: "/textures/back-cover.jpg" },
];

export default function App() {
  return (
    <Canvas camera={{ position: [0, 2, 6], fov: 45 }}>
      {/* You control the lights and camera controls */}
      <ambientLight intensity={1.0} />
      <directionalLight position={[5, 5, 5]} intensity={2.0} />
      <OrbitControls />

      {/* Reusable Book Component */}
      <Book
        pages={pages}
        position={[0, 0, 0]}
        scale={1.5}
      />
    </Canvas>
  );
}
```

---

## Architecture & Responsibility Model

`threejs-components` adheres strictly to the separation of scene concerns:

```text
                 APPLICATION
                     │
       ┌─────────────┼─────────────┐
       ↓             ↓             ↓
    Camera      OrbitControls    Lights
       │             │             │
       └─────────────┼─────────────┘
                     ↓
              YOUR COMPONENT
                     │
                   Book
                     │
        ┌────────────┼────────────┐
        ↓            ↓            ↓
    Geometry      Skeleton     Animation
        ↓            ↓            ↓
             Three.js / R3F
```

- **Application owns**: `<Canvas>`, `<PerspectiveCamera>`, `<OrbitControls>`, lights, post-processing, and UI state.
- **Library owns**: Skeletal mesh creation, bone hierarchy construction, skin index/weight computation, bone rotation damping, and page interaction events.

---

## Page Configuration

Each page in the `pages` array implements `BookPage`:

```ts
interface BookPage {
  /** Front face image URL or CSS color string (e.g. '#3b82f6') */
  front: string;

  /** Back face image URL or CSS color string (e.g. '#1e293b') */
  back: string;

  /** Optional roughness texture URL for the front face */
  frontRoughness?: string;

  /** Optional roughness texture URL for the back face */
  backRoughness?: string;

  /** Semantic page type ('cover' | 'page' | 'back-cover') */
  type?: 'cover' | 'page' | 'back-cover';
}
```

You can pass image URLs or CSS hex/color values interchangeably:

```tsx
const pages = [
  { front: '#0f172a', back: '#1e293b', type: 'cover' }, // Dark cover
  { front: '/textures/page-1.jpg', back: '/textures/page-2.jpg' },
  { front: '#1e293b', back: '#0f172a', type: 'back-cover' },
];
```

---

## Controlled Mode

To control active pages from outside React state (such as navigation buttons or sliders):

```tsx
import { useState } from 'react';
import { Book } from 'threejs-components';

export function ControlledBook() {
  const [page, setPage] = useState(0);

  return (
    <>
      <div className="controls">
        <button onClick={() => setPage((p) => Math.max(0, p - 1))}>Previous</button>
        <span>Page {page}</span>
        <button onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>

      <Canvas>
        <Book
          pages={pages}
          currentPage={page}
          onPageChange={setPage}
        />
      </Canvas>
    </>
  );
}
```

---

## Imperative Ref API

You can trigger page turns imperatively using a React `ref`:

```tsx
import { useRef } from 'react';
import { Book, type BookRef } from 'threejs-components';

export function RefControlledBook() {
  const bookRef = useRef<BookRef>(null);

  return (
    <>
      <button onClick={() => bookRef.current?.previous()}>Prev</button>
      <button onClick={() => bookRef.current?.next()}>Next</button>
      <button onClick={() => bookRef.current?.goToPage(3)}>Go to Page 3</button>
      <button onClick={() => bookRef.current?.firstPage()}>Cover</button>
      <button onClick={() => bookRef.current?.lastPage()}>Back Cover</button>

      <Canvas>
        <Book ref={bookRef} pages={pages} />
      </Canvas>
    </>
  );
}
```

### `BookRef` Methods

| Method | Signature | Description |
| :--- | :--- | :--- |
| `next()` | `() => void` | Turns forward to the next page |
| `previous()` | `() => void` | Turns backward to the previous page |
| `goToPage(page)` | `(page: number) => void` | Smoothly steps to target page number |
| `firstPage()` | `() => void` | Returns to front cover (page 0) |
| `lastPage()` | `() => void` | Turns to back cover (page N) |
| `getCurrentPage()` | `() => number` | Returns the currently active page index |
| `getTotalPages()` | `() => number` | Returns the total page count |

---

## Animation & Bending Physics

Customize the page bending S-curve, arching, and damping speeds via `animation`:

```tsx
<Book
  pages={pages}
  animation={{
    pageTurnDuration: 450,      // Page turn duration in milliseconds
    easingFactor: 0.5,          // Damping smoothing factor (0.1 = snappy, 0.8 = lazy)
    easingFactorFold: 0.2,      // Secondary fold easing factor
    insideCurveStrength: 0.18,  // Curvature towards the spine
    outsideCurveStrength: 0.05, // Outer page flare
    turningCurveStrength: 0.09, // Wave arc during turning transition
  }}
/>
```

---

## Material & Cover Customization

You can specify distinct surface materials for inner pages and outer covers:

```tsx
<Book
  pages={pages}
  pageMaterial={{
    roughness: 0.15,
    metalness: 0.0,
    highlightEmissiveIntensity: 0.25, // Glow intensity when hovered
    emissive: "#ffa500",
  }}
  coverMaterial={{
    roughness: 0.8,
    metalness: 0.1,
  }}
/>
```

---

## Component Props Reference

### `<Book />`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `pages` | `BookPage[]` | **Required** | Array of page textures/colors |
| `currentPage` | `number` | `undefined` | Controlled active page index |
| `defaultPage` | `number` | `0` | Initial page for uncontrolled mode |
| `onPageChange` | `(page: number) => void` | `undefined` | Callback fired when active page changes |
| `onPageTurnStart` | `(page: number) => void` | `undefined` | Callback when a page begins flipping |
| `onPageTurnComplete` | `(page: number) => void` | `undefined` | Callback when page flip completes |
| `onPageClick` | `(page: number) => void` | `undefined` | Callback when a page is clicked |
| `onPageHover` | `(page: number \| null) => void` | `undefined` | Callback when page is hovered or unhovered |
| `enableInteraction` | `boolean` | `true` | Enables pointer hover glows and click flips |
| `pageWidth` | `number` | `1.28` | Width in Three.js world units |
| `pageHeight` | `number` | `1.71` | Height in Three.js world units |
| `pageDepth` | `number` | `0.003` | Thickness of a single page leaf |
| `pageSegments` | `number` | `30` | Horizontal subdivisions for bone curvature |
| `pageMaterial` | `BookMaterialOptions` | `undefined` | Inner page material options |
| `coverMaterial` | `BookMaterialOptions` | `undefined` | Front & back cover material options |
| `animation` | `BookAnimationOptions` | `undefined` | Physics & damping tuning parameters |
| `position` | `[x, y, z]` | `undefined` | Three.js group position transform |
| `rotation` | `[x, y, z]` | `undefined` | Three.js group rotation transform |
| `scale` | `number \| [x, y, z]` | `undefined` | Three.js group scale transform |

---

## Performance Best Practices

1. **Geometry Reuse**: The segmented `BoxGeometry` is automatically cached in memory by dimensions and segments. Multiple pages and book instances share the GPU buffer geometry.
2. **Smooth Frame Updates**: Bone rotations are interpolated exclusively inside `useFrame` via `maath.easing.dampAngle`.
3. **Configurable Segments**: If rendering on lower-power devices (mobile), set `pageSegments={20}` for optimal fillrate. For high-end desktop presentations, `pageSegments={36}` yields ultra-smooth paper curvature.

---

## Future Components

The library is organized in modular folders under `src/`:

- `src/book/`: Interactive 3D Book
- `src/keyboard/`: 3D Mechanical Keyboard
- `src/particles/`: 3D Point Particle Fields
- `src/cards/`: 3D Interactive Tilt Cards

Each component is independently exported and supports tree-shaking:

```tsx
import { Book } from 'threejs-components/book';
import { Keyboard } from 'threejs-components/keyboard';
import { Particles } from 'threejs-components/particles';
import { Card3D } from 'threejs-components/cards';
```

---

## License

MIT © 2026
#   3 J s _ P a c k a g e  
 