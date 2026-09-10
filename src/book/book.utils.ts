import {
  Bone,
  BoxGeometry,
  Float32BufferAttribute,
  Skeleton,
  Uint16BufferAttribute,
  Vector3,
} from 'three';
import { easing } from 'maath';
import type { BookAnimationOptions } from './book.types';

export const DEFAULT_BOOK_OPTIONS = {
  pageWidth: 1.28,
  pageHeight: 1.71,
  pageDepth: 0.003,
  pageSegments: 30,

  pageTurnDuration: 400,

  easingFactor: 0.5,
  easingFactorFold: 0.2,

  insideCurveStrength: 0.18,
  outsideCurveStrength: 0.05,
  turningCurveStrength: 0.09,
} as const;

/**
 * Cache for reusable segmented page geometries to prevent memory leaks and redundant GPU uploads.
 */
const geometryCache = new Map<string, BoxGeometry>();

/**
 * Creates or retrieves a cached segmented BoxGeometry configured with skinning attributes.
 */
export function getOrCreatePageGeometry(
  width: number = DEFAULT_BOOK_OPTIONS.pageWidth,
  height: number = DEFAULT_BOOK_OPTIONS.pageHeight,
  depth: number = DEFAULT_BOOK_OPTIONS.pageDepth,
  segments: number = DEFAULT_BOOK_OPTIONS.pageSegments,
): BoxGeometry {
  const cacheKey = `${width.toFixed(4)}_${height.toFixed(4)}_${depth.toFixed(4)}_${segments}`;
  const existing = geometryCache.get(cacheKey);
  if (existing) {
    return existing;
  }

  const geometry = new BoxGeometry(width, height, depth, segments, 2);

  // Pivot alignment: shift the geometry along X so x=0 aligns with the book spine
  geometry.translate(width / 2, 0, 0);

  const segmentWidth = width / segments;
  const positionAttr = geometry.attributes.position;
  const vertex = new Vector3();
  const skinIndexes: number[] = [];
  const skinWeights: number[] = [];

  for (let i = 0; i < positionAttr.count; i++) {
    vertex.fromBufferAttribute(positionAttr, i);
    const x = Math.max(0, Math.min(width, vertex.x));

    let skinIndex = Math.floor(x / segmentWidth);
    if (skinIndex >= segments) {
      skinIndex = segments - 1;
    }

    const skinWeight = Math.min(1, Math.max(0, (x - skinIndex * segmentWidth) / segmentWidth));

    skinIndexes.push(skinIndex, skinIndex + 1, 0, 0);
    skinWeights.push(1 - skinWeight, skinWeight, 0, 0);
  }

  geometry.setAttribute('skinIndex', new Uint16BufferAttribute(skinIndexes, 4));
  geometry.setAttribute('skinWeight', new Float32BufferAttribute(skinWeights, 4));

  geometryCache.set(cacheKey, geometry);
  return geometry;
}

/**
 * Constructs a bone hierarchy chain and returns a new Three.js Skeleton for a single page.
 */
export function createPageSkeleton(
  segments: number = DEFAULT_BOOK_OPTIONS.pageSegments,
  segmentWidth: number = DEFAULT_BOOK_OPTIONS.pageWidth / DEFAULT_BOOK_OPTIONS.pageSegments,
): { skeleton: Skeleton; rootBone: Bone } {
  const bones: Bone[] = [];

  for (let i = 0; i <= segments; i++) {
    const bone = new Bone();
    bone.position.x = i === 0 ? 0 : segmentWidth;

    if (i > 0) {
      bones[i - 1].add(bone);
    }
    bones.push(bone);
  }

  const skeleton = new Skeleton(bones);
  return { skeleton, rootBone: bones[0] };
}

/**
 * Calculates bone rotation and bending angles along the spine during animation.
 */
export function calculateBoneRotation(
  boneIndex: number,
  totalBones: number,
  targetRotation: number,
  turningTime: number,
  bookClosed: boolean,
  animationOptions: Required<BookAnimationOptions>,
): number {
  if (bookClosed) {
    return boneIndex === 0 ? targetRotation : 0;
  }

  const insideCurveIntensity = boneIndex < 8 ? Math.sin(boneIndex * 0.2 + 0.15) : 0;
  const outsideCurveIntensity = boneIndex >= 8 ? Math.cos(boneIndex * 0.3 + 0.09) : 0;
  const turningIntensity = Math.sin(boneIndex * Math.PI * (1 / totalBones)) * turningTime;

  const rotationAngle =
    animationOptions.insideCurveStrength * insideCurveIntensity * targetRotation -
    animationOptions.outsideCurveStrength * outsideCurveIntensity * targetRotation +
    animationOptions.turningCurveStrength * turningIntensity * targetRotation;

  return rotationAngle;
}

/**
 * Smoothly damps an angular rotation towards a target value without discontinuity jumps.
 */
export function smoothDampAngle(
  current: { y: number },
  targetAngle: number,
  easingFactor: number,
  delta: number,
): void {
  easing.dampAngle(current, 'y', targetAngle, easingFactor, delta);
}

/**
 * Clamps a page index to valid book bounds [0, maxPages].
 */
export function clampPage(page: number, maxPages: number): number {
  if (Number.isNaN(page)) return 0;
  return Math.max(0, Math.min(Math.round(page), Math.max(0, maxPages)));
}
