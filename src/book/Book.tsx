import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Bone,
  BoxGeometry,
  Color,
  Float32BufferAttribute,
  MathUtils,
  MeshStandardMaterial,
  Skeleton,
  SkinnedMesh,
  SRGBColorSpace,
  Texture,
  TextureLoader,
  Uint16BufferAttribute,
  Vector3,
} from 'three';
import { useCursor } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { degToRad } from 'three/src/math/MathUtils.js';
import type {
  BookAnimationOptions,
  BookMaterialOptions,
  BookPage,
  BookProps,
  BookRef,
} from './book.types';

const PAGE_WIDTH = 1.28;
const PAGE_HEIGHT = 1.71;
const PAGE_DEPTH = 0.003;
const PAGE_SEGMENTS = 30;
const SEGMENT_WIDTH = PAGE_WIDTH / PAGE_SEGMENTS;

const easingFactor = 0.5;
const easingFactorFold = 0.2;
const insideCurveStrength = 0.18;
const outsideCurveStrength = 0.05;
const turningCurveStrength = 0.09;

// Segmented BoxGeometry with skinIndex and skinWeight
const sharedPageGeometry = new BoxGeometry(
  PAGE_WIDTH,
  PAGE_HEIGHT,
  PAGE_DEPTH,
  PAGE_SEGMENTS,
  2,
);
sharedPageGeometry.translate(PAGE_WIDTH / 2, 0, 0);

const positionAttr = sharedPageGeometry.attributes.position;
const vertex = new Vector3();
const skinIndexes: number[] = [];
const skinWeights: number[] = [];

for (let i = 0; i < positionAttr.count; i++) {
  vertex.fromBufferAttribute(positionAttr, i);
  const x = vertex.x;

  const skinIndex = Math.floor(x / SEGMENT_WIDTH);
  const skinWeight = (x % SEGMENT_WIDTH) / SEGMENT_WIDTH;

  skinIndexes.push(skinIndex, skinIndex + 1, 0, 0);
  skinWeights.push(1 - skinWeight, skinWeight, 0, 0);
}

sharedPageGeometry.setAttribute(
  'skinIndex',
  new Uint16BufferAttribute(skinIndexes, 4),
);
sharedPageGeometry.setAttribute(
  'skinWeight',
  new Float32BufferAttribute(skinWeights, 4),
);

const whiteColor = new Color('white');
const emissiveColor = new Color('orange');

const defaultEdgeMaterials = [
  new MeshStandardMaterial({ color: whiteColor }),
  new MeshStandardMaterial({ color: '#111' }),
  new MeshStandardMaterial({ color: whiteColor }),
  new MeshStandardMaterial({ color: whiteColor }),
];

const isCssColor = (str?: string): boolean => {
  if (!str) return false;
  const trimmed = str.trim().toLowerCase();
  return (
    trimmed.startsWith('#') ||
    trimmed.startsWith('rgb') ||
    trimmed.startsWith('hsl') ||
    ['white', 'black', 'gray', 'grey', 'red', 'blue', 'green', 'yellow', 'orange', 'purple'].includes(trimmed)
  );
};

interface SinglePageProps {
  number: number;
  totalPages: number;
  pageData: BookPage;
  opened: boolean;
  bookClosed: boolean;
  page: number; // delayedPage
  pageMaterial?: BookMaterialOptions;
  coverMaterial?: BookMaterialOptions;
  animationOptions?: BookAnimationOptions;
  enableInteraction?: boolean;
  onSelectPage: (targetPage: number) => void;
  onHoverPage: (pageIndex: number | null) => void;
}

function Page({
  number,
  totalPages,
  pageData,
  opened,
  bookClosed,
  page,
  pageMaterial,
  coverMaterial,
  animationOptions,
  enableInteraction = true,
  onSelectPage,
  onHoverPage,
}: SinglePageProps) {
  const group = useRef<any>(null);
  const skinnedMeshRef = useRef<SkinnedMesh>(null);
  const turnedAt = useRef<number>(0);
  const lastOpened = useRef<boolean>(opened);
  const [highlighted, setHighlighted] = useState(false);

  useCursor(enableInteraction && highlighted);

  const isCover = number === 0;
  const isBackCover = number === totalPages - 1;

  const [frontTexture, setFrontTexture] = useState<Texture | undefined>();
  const [backTexture, setBackTexture] = useState<Texture | undefined>();

  useEffect(() => {
    let isMounted = true;
    const loader = new TextureLoader();

    if (pageData.front && !isCssColor(pageData.front)) {
      loader.load(
        pageData.front,
        (tex) => {
          if (!isMounted) return;
          tex.colorSpace = SRGBColorSpace;
          setFrontTexture(tex);
        },
        undefined,
        () => {},
      );
    } else {
      setFrontTexture(undefined);
    }

    if (pageData.back && !isCssColor(pageData.back)) {
      loader.load(
        pageData.back,
        (tex) => {
          if (!isMounted) return;
          tex.colorSpace = SRGBColorSpace;
          setBackTexture(tex);
        },
        undefined,
        () => {},
      );
    } else {
      setBackTexture(undefined);
    }

    return () => {
      isMounted = false;
    };
  }, [pageData.front, pageData.back]);

  const manualSkinnedMesh = useMemo(() => {
    const bones: Bone[] = [];

    for (let i = 0; i <= PAGE_SEGMENTS; i++) {
      const bone = new Bone();
      bone.position.x = i === 0 ? 0 : SEGMENT_WIDTH;

      if (i > 0) {
        bones[i - 1].add(bone);
      }

      bones.push(bone);
    }

    const skeleton = new Skeleton(bones);

    const frontColor = isCssColor(pageData.front) ? new Color(pageData.front) : whiteColor;
    const backColor = isCssColor(pageData.back) ? new Color(pageData.back) : whiteColor;

    const resolvedRoughness = isCover || isBackCover ? 0.8 : 0.1;

    const materials = [
      ...defaultEdgeMaterials,

      // Front face (+Z)
      new MeshStandardMaterial({
        color: frontColor,
        map: frontTexture,
        roughness: pageMaterial?.roughness ?? resolvedRoughness,
        metalness: pageMaterial?.metalness ?? 0,
        emissive: pageMaterial?.emissive ? new Color(pageMaterial.emissive) : emissiveColor,
        emissiveIntensity: 0,
      }),

      // Back face (-Z)
      new MeshStandardMaterial({
        color: backColor,
        map: backTexture,
        roughness: pageMaterial?.roughness ?? resolvedRoughness,
        metalness: pageMaterial?.metalness ?? 0,
        emissive: pageMaterial?.emissive ? new Color(pageMaterial.emissive) : emissiveColor,
        emissiveIntensity: 0,
      }),
    ];

    const mesh = new SkinnedMesh(sharedPageGeometry, materials);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.frustumCulled = false;

    mesh.add(skeleton.bones[0]);
    mesh.bind(skeleton);

    return mesh;
  }, [frontTexture, backTexture, pageData.front, pageData.back, isCover, isBackCover, pageMaterial]);

  useFrame((_, delta) => {
    if (!skinnedMeshRef.current || !group.current) return;

    const emissiveIntensity = enableInteraction && highlighted ? 0.22 : 0;
    const mats = skinnedMeshRef.current.material as MeshStandardMaterial[];
    if (mats[4] && mats[5]) {
      mats[4].emissiveIntensity = mats[5].emissiveIntensity = MathUtils.lerp(
        mats[4].emissiveIntensity,
        emissiveIntensity,
        0.1,
      );
    }

    if (lastOpened.current !== opened) {
      turnedAt.current = +new Date();
      lastOpened.current = opened;
    }

    let turningTime = Math.min(400, new Date().getTime() - turnedAt.current) / 400;
    turningTime = Math.sin(turningTime * Math.PI);

    let TargetRotation = opened ? -Math.PI / 2 : Math.PI / 2;

    if (!bookClosed) {
      TargetRotation += degToRad(number * 0.5);
    }

    const bones = skinnedMeshRef.current.skeleton.bones;

    const animEasing = animationOptions?.easingFactor ?? easingFactor;
    const animInside = animationOptions?.insideCurveStrength ?? insideCurveStrength;
    const animOutside = animationOptions?.outsideCurveStrength ?? outsideCurveStrength;

    for (let i = 0; i < bones.length; i++) {
      const insideCurveIntensity = i < 8 ? Math.sin(i * 0.2 + 0.15) : 0;
      const outsideCurveIntensity = i >= 8 ? Math.cos(i * 0.3 + 0.09) : 0;

      let rotationAngle =
        animInside * insideCurveIntensity * TargetRotation -
        animOutside * outsideCurveIntensity * TargetRotation;

      if (bookClosed) {
        if (i === 0) {
          rotationAngle = TargetRotation;
        } else {
          rotationAngle = 0;
        }
      }

      const target = i === 0 ? group.current : bones[i];
      easing.dampAngle(
        target.rotation,
        'y',
        rotationAngle,
        animEasing,
        delta,
      );
    }
  });

  return (
    <group
      scale={2}
      ref={group}
      onPointerEnter={(e) => {
        if (!enableInteraction) return;
        e.stopPropagation();
        setHighlighted(true);
        onHoverPage(number);
      }}
      onPointerLeave={(e) => {
        if (!enableInteraction) return;
        e.stopPropagation();
        setHighlighted(false);
        onHoverPage(null);
      }}
      onClick={(e) => {
        if (!enableInteraction) return;
        e.stopPropagation();
        onSelectPage(opened ? number : number + 1);
        setHighlighted(false);
      }}
    >
      <primitive
        object={manualSkinnedMesh}
        ref={skinnedMeshRef}
        position-z={-number * PAGE_DEPTH + page * PAGE_DEPTH}
      />
    </group>
  );
}

export const Book = forwardRef<BookRef, BookProps>(function Book(
  {
    pages,
    currentPage: controlledPage,
    defaultPage = 0,
    onPageChange,
    onPageTurnStart,
    onPageTurnComplete,
    onPageClick,
    onPageHover,
    enableInteraction = true,
    pageMaterial,
    coverMaterial,
    animation,
    position,
    rotation,
    scale,
    ...restGroupProps
  },
  ref,
) {
  const isControlled = controlledPage !== undefined;
  const [internalPage, setInternalPage] = useState(defaultPage);

  const activePage = isControlled ? controlledPage : internalPage;
  const [delayedPage, setDelayedPage] = useState(activePage);

  const setPageSafe = useCallback(
    (target: number) => {
      const clamped = Math.max(0, Math.min(target, pages.length));
      if (!isControlled) {
        setInternalPage(clamped);
      }
      onPageChange?.(clamped);
      onPageClick?.(clamped);
    },
    [isControlled, pages.length, onPageChange, onPageClick],
  );

  // Exact step turnover system from original prototype
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;

    const goToPage = () => {
      setDelayedPage((currentDelayed) => {
        if (activePage === currentDelayed) {
          return currentDelayed;
        }

        timeout = setTimeout(
          () => {
            goToPage();
          },
          Math.abs(activePage - currentDelayed) > 2 ? 50 : 100,
        );

        if (activePage > currentDelayed) {
          return currentDelayed + 1;
        }
        if (activePage < currentDelayed) {
          return currentDelayed - 1;
        }
        return currentDelayed;
      });
    };

    goToPage();

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [activePage]);

  useImperativeHandle(
    ref,
    () => ({
      next: () => setPageSafe(activePage + 1),
      previous: () => setPageSafe(activePage - 1),
      goToPage: (p: number) => setPageSafe(p),
      firstPage: () => setPageSafe(0),
      lastPage: () => setPageSafe(pages.length),
      getCurrentPage: () => activePage,
      getTotalPages: () => pages.length,
    }),
    [activePage, pages.length, setPageSafe],
  );

  const handleHover = useCallback(
    (idx: number | null) => {
      onPageHover?.(idx);
    },
    [onPageHover],
  );

  return (
    <group
      position={position}
      rotation={rotation}
      scale={scale}
      {...restGroupProps}
    >
      <group rotation-y={-Math.PI / 2}>
        {pages.map((pageData, index) => (
          <Page
            key={index}
            number={index}
            totalPages={pages.length}
            pageData={pageData}
            opened={delayedPage > index}
            bookClosed={delayedPage === 0 || delayedPage === pages.length}
            page={delayedPage}
            pageMaterial={pageMaterial}
            coverMaterial={coverMaterial}
            animationOptions={animation}
            enableInteraction={enableInteraction}
            onSelectPage={setPageSafe}
            onHoverPage={handleHover}
          />
        ))}
      </group>
    </group>
  );
});
