import { useEffect, useMemo, useRef, CSSProperties, ReactNode } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";

export interface ParticleLoaderProps {
  /**
   * Color of the grid boxes / pixels.
   * Can be a hex string (e.g., "#484747", "#3b82f6"), color name, or THREE.ColorRepresentation.
   * @default "#484747"
   */
  color?: THREE.ColorRepresentation;

  /**
   * Alias for `color`.
   */
  boxColor?: THREE.ColorRepresentation;

  /**
   * Background color of the container overlay (e.g., "transparent", "#000000", "rgba(0,0,0,0.8)").
   * @default "transparent"
   */
  backgroundColor?: string;

  /**
   * Size of each grid box / pixel in CSS pixels.
   * @default 65.0
   */
  boxSize?: number;

  /**
   * Alias for `boxSize`.
   */
  uBoxSize?: number;

  /**
   * Alias for `boxSize`.
   */
  pixelSize?: number;

  /**
   * Total animation duration in seconds.
   * @default 2.2
   */
  duration?: number;

  /**
   * Animation start delay in seconds.
   * @default 0.6
   */
  delay?: number;

  /**
   * GSAP ease function or name (e.g., "power2.inOut", "power3.out", "sine.inOut").
   * @default "power2.inOut"
   */
  ease?: string;

  /**
   * Individual cell fade transition duration window (relative range 0.01 - 1.0).
   * @default 0.28
   */
  fadeDuration?: number;

  /**
   * Callback fired when the animation finishes.
   */
  onComplete?: () => void;

  /**
   * Whether to automatically run the GSAP transition on mount.
   * @default true
   */
  autoPlay?: boolean;

  /**
   * Manually control progress (0.0 = fully visible, 1.0 = fully faded out).
   * When provided, automatic GSAP animation is bypassed.
   */
  progress?: number;

  /**
   * If true, reverses animation direction (fades from transparent to visible).
   * @default false
   */
  reverse?: boolean;

  /**
   * Canvas Device Pixel Ratio (DPR).
   * @default Math.min(window.devicePixelRatio || 1, 2)
   */
  dpr?: number | [number, number];

  /**
   * Z-index for the container overlay.
   * @default 50
   */
  zIndex?: number;

  /**
   * Custom CSS class name for the wrapper element.
   * @default "fixed inset-0 w-screen h-screen z-50 pointer-events-none"
   */
  className?: string;

  /**
   * Custom inline styles for the wrapper element.
   */
  style?: CSSProperties;

  /**
   * Optional child elements to display alongside or on top of the loader.
   */
  children?: ReactNode;
}

export const DEFAULT_PARTICLE_LOADER_OPTIONS = {
  color: "#484747",
  backgroundColor: "transparent",
  boxSize: 65.0,
  duration: 2.2,
  delay: 0.6,
  ease: "power2.inOut",
  fadeDuration: 0.28,
  autoPlay: true,
  reverse: false,
  zIndex: 50,
} as const;

const vertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec2 uResolution;
  uniform float uTime;
  uniform float uBoxSize;
  uniform float uProgress;
  uniform vec3 uColor;
  uniform float uFadeDuration;

  varying vec2 vUv;

  // High quality pseudo-random function per grid cell coordinate
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  void main() {
    // Screen pixel coordinate in CSS pixels
    vec2 pixel = vUv * uResolution;
    float cellSize = max(uBoxSize, 1.0);

    // Unique coordinate for each grid cell
    vec2 cellCoord = floor(pixel / cellSize);

    // Position inside the current cell
    vec2 cell = mod(pixel, cellSize);

    // Discard gap/border pixels if applicable
    if (cell.x >= uBoxSize || cell.y >= uBoxSize) {
      discard;
    }

    // Random float [0.0, 1.0] for each box
    float randVal = random(cellCoord);

    // Each box fades randomly from 1 to 0 over a staggered window
    float fade = clamp(uFadeDuration, 0.001, 0.999);
    float startFade = randVal * (1.0 - fade);
    float alpha = 1.0 - smoothstep(startFade, startFade + fade, uProgress);

    // Discard completely transparent cells
    if (alpha <= 0.001) {
      discard;
    }

    gl_FragColor = vec4(uColor, alpha);
  }
`;

interface GridPlaneInternalProps {
  color: THREE.ColorRepresentation;
  boxSize: number;
  duration: number;
  delay: number;
  ease: string;
  fadeDuration: number;
  onComplete?: () => void;
  autoPlay: boolean;
  progress?: number;
  reverse: boolean;
}

const GridPlane = ({
  color,
  boxSize,
  duration,
  delay,
  ease,
  fadeDuration,
  onComplete,
  autoPlay,
  progress,
  reverse,
}: GridPlaneInternalProps) => {
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const { size } = useThree();

  const initialColor = useMemo(() => new THREE.Color(color), []);

  const uniforms = useMemo(
    () => ({
      uResolution: {
        value: new THREE.Vector2(size.width, size.height),
      },
      uTime: {
        value: 0,
      },
      uBoxSize: {
        value: boxSize,
      },
      uProgress: {
        value: reverse ? 1.0 : 0.0,
      },
      uColor: {
        value: initialColor,
      },
      uFadeDuration: {
        value: fadeDuration,
      },
    }),
    []
  );

  // Update resolution on resize
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uResolution.value.set(size.width, size.height);
    }
  }, [size.width, size.height]);

  // Update dynamic uniforms when props change
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uBoxSize.value = boxSize;
    }
  }, [boxSize]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uFadeDuration.value = fadeDuration;
    }
  }, [fadeDuration]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uColor.value.set(color as THREE.ColorRepresentation);
    }
  }, [color]);

  // Controlled progress sync
  useEffect(() => {
    if (progress !== undefined && materialRef.current) {
      materialRef.current.uniforms.uProgress.value = THREE.MathUtils.clamp(progress, 0, 1);
    }
  }, [progress]);

  // Animate uProgress with GSAP if autoPlay is enabled and no manual progress
  useEffect(() => {
    if (!materialRef.current || !autoPlay || progress !== undefined) return;

    const startVal = reverse ? 1.0 : 0.0;
    const targetVal = reverse ? 0.0 : 1.0;

    materialRef.current.uniforms.uProgress.value = startVal;

    const progressTween = gsap.to(materialRef.current.uniforms.uProgress, {
      value: targetVal,
      duration,
      delay,
      ease,
      onComplete: () => {
        if (onComplete) {
          onComplete();
        }
      },
    });

    return () => {
      progressTween.kill();
    };
  }, [autoPlay, duration, delay, ease, onComplete, progress, reverse]);

  // Render loop
  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
};

export const ParticleLoader = ({
  color,
  boxColor,
  backgroundColor = DEFAULT_PARTICLE_LOADER_OPTIONS.backgroundColor,
  boxSize,
  uBoxSize,
  pixelSize,
  duration = DEFAULT_PARTICLE_LOADER_OPTIONS.duration,
  delay = DEFAULT_PARTICLE_LOADER_OPTIONS.delay,
  ease = DEFAULT_PARTICLE_LOADER_OPTIONS.ease,
  fadeDuration = DEFAULT_PARTICLE_LOADER_OPTIONS.fadeDuration,
  onComplete,
  autoPlay = DEFAULT_PARTICLE_LOADER_OPTIONS.autoPlay,
  progress,
  reverse = DEFAULT_PARTICLE_LOADER_OPTIONS.reverse,
  dpr,
  zIndex = DEFAULT_PARTICLE_LOADER_OPTIONS.zIndex,
  className = "fixed inset-0 w-screen h-screen z-50 pointer-events-none",
  style,
  children,
}: ParticleLoaderProps) => {
  const resolvedColor = color ?? boxColor ?? DEFAULT_PARTICLE_LOADER_OPTIONS.color;
  const resolvedBoxSize = boxSize ?? uBoxSize ?? pixelSize ?? DEFAULT_PARTICLE_LOADER_OPTIONS.boxSize;
  const resolvedDpr = dpr ?? (typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1);

  return (
    <div
      className={className}
      style={{
        backgroundColor,
        zIndex,
        position: "fixed",
        inset: 0,
        ...style,
      }}
    >
      <Canvas
        gl={{ antialias: false, alpha: true }}
        dpr={resolvedDpr}
      >
        <GridPlane
          color={resolvedColor}
          boxSize={resolvedBoxSize}
          duration={duration}
          delay={delay}
          ease={ease}
          fadeDuration={fadeDuration}
          onComplete={onComplete}
          autoPlay={autoPlay}
          progress={progress}
          reverse={reverse}
        />
      </Canvas>
      {children}
    </div>
  );
};

// Default export and snake_case alias for backward compatibility
export const Particle_Loader = ParticleLoader;
export default ParticleLoader;