import type { ThreeElements } from '@react-three/fiber';
import type { Color, Texture } from 'three';

export type GroupProps = ThreeElements['group'];

/**
 * Represents a single page in the 3D Book.
 */
export interface BookPage {
  /**
   * Front face texture URL, image source, or color.
   */
  front: string;

  /**
   * Back face texture URL, image source, or color.
   */
  back: string;

  /**
   * Optional roughness texture URL for the front face.
   */
  frontRoughness?: string;

  /**
   * Optional roughness texture URL for the back face.
   */
  backRoughness?: string;

  /**
   * Semantic page type: 'cover' (first page), 'page' (standard), or 'back-cover' (last page).
   * If omitted, types are automatically inferred based on page index.
   */
  type?: 'cover' | 'page' | 'back-cover';
}

/**
 * Customization options for page surface materials.
 */
export interface BookMaterialOptions {
  /**
   * Base color applied under textures or when textures are absent.
   * Default: "#ffffff"
   */
  color?: string | Color;

  /**
   * Page surface roughness (0 = mirror smooth, 1 = rough paper).
   * Default: 0.1 for inner pages, 1.0 for covers.
   */
  roughness?: number;

  /**
   * Page surface metalness (0 = non-metallic paper, 1 = metallic foil).
   * Default: 0.0
   */
  metalness?: number;

  /**
   * Optional global roughness map applied to pages.
   */
  roughnessMap?: Texture | string;

  /**
   * Emissive color on hover/highlight.
   * Default: "#ffa500" (orange glow)
   */
  emissive?: string | Color;

  /**
   * Emissive intensity when idle.
   * Default: 0.0
   */
  emissiveIntensity?: number;

  /**
   * Emissive intensity when hovered or selected.
   * Default: 0.22
   */
  highlightEmissiveIntensity?: number;
}

/**
 * Physics and interpolation tuning options for the page-turning animation.
 */
export interface BookAnimationOptions {
  /**
   * Total duration of the page turn in milliseconds.
   * Default: 400
   */
  pageTurnDuration?: number;

  /**
   * Smoothing factor for bone rotation damping (lower = snappier, higher = lazier).
   * Default: 0.5
   */
  easingFactor?: number;

  /**
   * Secondary fold easing factor.
   * Default: 0.2
   */
  easingFactorFold?: number;

  /**
   * Bending curvature strength towards the book spine.
   * Default: 0.18
   */
  insideCurveStrength?: number;

  /**
   * Outward page flare curvature strength.
   * Default: 0.05
   */
  outsideCurveStrength?: number;

  /**
   * Wave arching curvature while the page is actively transitioning.
   * Default: 0.09
   */
  turningCurveStrength?: number;
}

/**
 * Imperative ref methods exposed on `<Book ref={bookRef} />`.
 */
export interface BookRef {
  /**
   * Turns to the next page.
   */
  next: () => void;

  /**
   * Turns to the previous page.
   */
  previous: () => void;

  /**
   * Jumps or turns smoothly to a specific target page index.
   */
  goToPage: (page: number) => void;

  /**
   * Turns to the front cover (page 0).
   */
  firstPage: () => void;

  /**
   * Turns to the back cover (page N).
   */
  lastPage: () => void;

  /**
   * Returns the currently active page index.
   */
  getCurrentPage: () => number;

  /**
   * Returns the total number of pages in the book.
   */
  getTotalPages: () => number;
}

/**
 * Component props for `<Book />`.
 * Inherits all standard React Three Fiber `GroupProps` (position, rotation, scale, etc.).
 */
export interface BookProps extends Omit<GroupProps, 'ref'> {
  /**
   * Array of page descriptors (front and back textures/colors).
   */
  pages: BookPage[];

  /**
   * Controlled active page index (0 to pages.length).
   * When provided, the component acts as a controlled component.
   */
  currentPage?: number;

  /**
   * Initial page index for uncontrolled mode.
   * Default: 0
   */
  defaultPage?: number;

  /**
   * Callback fired when the active page index changes.
   */
  onPageChange?: (page: number) => void;

  /**
   * Callback fired when a page begins its turn animation.
   */
  onPageTurnStart?: (page: number) => void;

  /**
   * Callback fired when a page completes its turn animation.
   */
  onPageTurnComplete?: (page: number) => void;

  /**
   * Callback fired when a page is clicked.
   */
  onPageClick?: (page: number) => void;

  /**
   * Callback fired when a page is hovered or unhovered.
   */
  onPageHover?: (page: number | null) => void;

  /**
   * Whether mouse/pointer clicks and hover highlights are enabled.
   * Default: true
   */
  enableInteraction?: boolean;

  /**
   * Physical width of a single page in 3D units.
   * Default: 1.28
   */
  pageWidth?: number;

  /**
   * Physical height of a single page in 3D units.
   * Default: 1.71
   */
  pageHeight?: number;

  /**
   * Thickness / depth of each page leaf.
   * Default: 0.003
   */
  pageDepth?: number;

  /**
   * Horizontal subdivisions for bone weighting and curvature bending.
   * Higher values yield smoother bending at a slight performance cost.
   * Default: 30
   */
  pageSegments?: number;

  /**
   * Material settings for regular inner pages.
   */
  pageMaterial?: BookMaterialOptions;

  /**
   * Distinct material settings for cover pages (first and last).
   */
  coverMaterial?: BookMaterialOptions;

  /**
   * Optional animation fine-tuning parameters.
   */
  animation?: BookAnimationOptions;
}
