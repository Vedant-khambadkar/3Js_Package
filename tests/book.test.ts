import { describe, it, expect } from 'vitest';
import {
  clampPage,
  DEFAULT_BOOK_OPTIONS,
  calculateBoneRotation,
  getOrCreatePageGeometry,
  createPageSkeleton,
} from '../src/book/book.utils';

describe('Book Utilities & Math', () => {
  describe('clampPage', () => {
    it('should clamp within valid page range [0, maxPages]', () => {
      expect(clampPage(-5, 10)).toBe(0);
      expect(clampPage(0, 10)).toBe(0);
      expect(clampPage(5, 10)).toBe(5);
      expect(clampPage(10, 10)).toBe(10);
      expect(clampPage(15, 10)).toBe(10);
    });

    it('should handle zero pages safely', () => {
      expect(clampPage(0, 0)).toBe(0);
      expect(clampPage(2, 0)).toBe(0);
      expect(clampPage(-1, 0)).toBe(0);
    });

    it('should round non-integer page numbers', () => {
      expect(clampPage(2.4, 5)).toBe(2);
      expect(clampPage(2.7, 5)).toBe(3);
    });

    it('should handle NaN input by defaulting to 0', () => {
      expect(clampPage(NaN, 10)).toBe(0);
    });
  });

  describe('DEFAULT_BOOK_OPTIONS', () => {
    it('should provide sensible default dimensions and animation physics', () => {
      expect(DEFAULT_BOOK_OPTIONS.pageWidth).toBe(1.28);
      expect(DEFAULT_BOOK_OPTIONS.pageHeight).toBe(1.71);
      expect(DEFAULT_BOOK_OPTIONS.pageDepth).toBe(0.003);
      expect(DEFAULT_BOOK_OPTIONS.pageSegments).toBe(30);
      expect(DEFAULT_BOOK_OPTIONS.pageTurnDuration).toBe(400);
      expect(DEFAULT_BOOK_OPTIONS.easingFactor).toBe(0.5);
      expect(DEFAULT_BOOK_OPTIONS.insideCurveStrength).toBe(0.18);
      expect(DEFAULT_BOOK_OPTIONS.outsideCurveStrength).toBe(0.05);
      expect(DEFAULT_BOOK_OPTIONS.turningCurveStrength).toBe(0.09);
    });
  });

  describe('calculateBoneRotation', () => {
    it('returns targetRotation for root bone when book is closed', () => {
      const rot = calculateBoneRotation(
        0,
        31,
        -Math.PI / 2,
        0,
        true,
        DEFAULT_BOOK_OPTIONS as any,
      );
      expect(rot).toBe(-Math.PI / 2);
    });

    it('returns 0 for non-root bones when book is closed', () => {
      const rot = calculateBoneRotation(
        5,
        31,
        -Math.PI / 2,
        0,
        true,
        DEFAULT_BOOK_OPTIONS as any,
      );
      expect(rot).toBe(0);
    });

    it('calculates curvature bending when book is open and turning', () => {
      const rotAtBone2 = calculateBoneRotation(
        2,
        31,
        -Math.PI / 2,
        0.5,
        false,
        DEFAULT_BOOK_OPTIONS as any,
      );
      expect(typeof rotAtBone2).toBe('number');
      expect(rotAtBone2).not.toBe(0);
    });
  });

  describe('getOrCreatePageGeometry & createPageSkeleton', () => {
    it('should create segmented geometry with skinIndex and skinWeight attributes', () => {
      const geom = getOrCreatePageGeometry(1.28, 1.71, 0.003, 10);
      expect(geom).toBeDefined();

      const skinIndexAttr = geom.getAttribute('skinIndex');
      const skinWeightAttr = geom.getAttribute('skinWeight');

      expect(skinIndexAttr).toBeDefined();
      expect(skinWeightAttr).toBeDefined();
      expect(skinIndexAttr.itemSize).toBe(4);
      expect(skinWeightAttr.itemSize).toBe(4);
    });

    it('should reuse cached geometry for matching dimensions', () => {
      const geom1 = getOrCreatePageGeometry(1.5, 2.0, 0.004, 20);
      const geom2 = getOrCreatePageGeometry(1.5, 2.0, 0.004, 20);
      expect(geom1).toBe(geom2);
    });

    it('should create a valid parent-child bone hierarchy and Skeleton', () => {
      const { skeleton, rootBone } = createPageSkeleton(10, 0.1);
      expect(skeleton.bones.length).toBe(11);
      expect(skeleton.bones[0]).toBe(rootBone);
      expect(rootBone.position.x).toBe(0);
      expect(skeleton.bones[1].position.x).toBe(0.1);
    });
  });
});
