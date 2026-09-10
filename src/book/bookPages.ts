import { type BookPage } from '.';

/**
 * Procedural high-resolution canvas textures for realistic book pages.
 */
export function createPageDataUrl(
  title: string,
  subtitle: string,
  pageNumber: string,
  bgColor: string,
  textColor: string,
  accentColor: string,
  isCover = false,
): string {
  if (typeof document === 'undefined') return bgColor;
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 1068;
  const ctx = canvas.getContext('2d');
  if (!ctx) return bgColor;

  // Page background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (isCover) {
    // Elegant luxury cloth cover with gold embossed borders
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 6;
    ctx.strokeRect(34, 34, canvas.width - 68, canvas.height - 68);

    ctx.lineWidth = 1.5;
    ctx.strokeRect(46, 46, canvas.width - 92, canvas.height - 92);

    // Corner Ornaments
    const drawCorner = (x: number, y: number) => {
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.arc(x, y, 7, 0, Math.PI * 2);
      ctx.fill();
    };
    drawCorner(54, 54);
    drawCorner(canvas.width - 54, 54);
    drawCorner(54, canvas.height - 54);
    drawCorner(canvas.width - 54, canvas.height - 54);

    // Title
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 44px "Outfit", "Georgia", serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, canvas.width / 2, 380);

    // Ornamental Divider
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 110, 425);
    ctx.lineTo(canvas.width / 2 + 110, 425);
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Subtitle
    ctx.fillStyle = textColor;
    ctx.font = '500 20px "Outfit", "Georgia", serif';
    ctx.fillText(subtitle, canvas.width / 2, 470);

    // Center Gold Seal Emblem
    ctx.beginPath();
    ctx.arc(canvas.width / 2, 670, 48, 0, Math.PI * 2);
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = accentColor;
    ctx.font = '32px serif';
    ctx.fillText('✦', canvas.width / 2, 682);
  } else {
    // Inner Paper Page
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.06)';
    ctx.lineWidth = 1;
    ctx.strokeRect(42, 42, canvas.width - 84, canvas.height - 84);

    // Header label
    ctx.fillStyle = '#64748b';
    ctx.font = '600 15px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(subtitle.toUpperCase(), 64, 86);

    // Chapter heading
    ctx.fillStyle = textColor;
    ctx.font = 'bold 36px "Outfit", serif';
    ctx.textAlign = 'left';
    ctx.fillText(title, 64, 160);

    // Editorial typography body
    ctx.fillStyle = '#334155';
    ctx.font = '19px/32px "Georgia", serif';
    const lines = [
      'Interactive 3D surfaces built with React Three Fiber',
      'and Three.js deliver immersive web experiences.',
      '',
      'This page bends dynamically using skeletal skinning',
      'and damped bone rotations along the spine axis.',
      '',
      '• Segmented BoxGeometry with 30 bones',
      '• Normalized skinIndex & skinWeight vertex buffers',
      '• Smooth damping with easing.dampAngle',
      '• High-performance useFrame physics updates',
      '',
      'Click on this page to turn forward or backward.',
    ];

    let y = 230;
    for (const line of lines) {
      ctx.fillText(line, 64, y);
      y += 34;
    }

    // Bottom page numeral
    ctx.fillStyle = '#64748b';
    ctx.font = '600 17px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(pageNumber, canvas.width / 2, canvas.height - 62);
  }

  return canvas.toDataURL('image/jpeg', 0.9);
}

/**
 * Default sample pages data for the interactive 3D book demonstration.
 */
export const samplePages: BookPage[] = [
  {
    front: createPageDataUrl(
      'THREE.JS BOOK',
      'Interactive 3D Component',
      'Cover',
      '#1e1b4b',
      '#e0e7ff',
      '#fbbf24',
      true,
    ),
    back: createPageDataUrl(
      'Introduction',
      'Getting Started',
      '1',
      '#fdfbf7',
      '#0f172a',
      '#4338ca',
    ),
  },
  {
    front: createPageDataUrl(
      'Chapter 1',
      'Skeletal Mesh',
      '2',
      '#fdfbf7',
      '#0f172a',
      '#047857',
    ),
    back: createPageDataUrl(
      'Chapter 2',
      'Bone Weights',
      '3',
      '#fdfbf7',
      '#0f172a',
      '#047857',
    ),
  },
  {
    front: createPageDataUrl(
      'Chapter 3',
      'Bending Curves',
      '4',
      '#fdfbf7',
      '#0f172a',
      '#b45309',
    ),
    back: createPageDataUrl(
      'Chapter 4',
      'Rotation Physics',
      '5',
      '#fdfbf7',
      '#0f172a',
      '#b45309',
    ),
  },
  {
    front: createPageDataUrl(
      'Chapter 5',
      'Damped Easing',
      '6',
      '#fdfbf7',
      '#0f172a',
      '#be123c',
    ),
    back: createPageDataUrl(
      'Chapter 6',
      'Performance Tips',
      '7',
      '#fdfbf7',
      '#0f172a',
      '#be123c',
    ),
  },
  {
    front: createPageDataUrl(
      'Appendix',
      'Component Architecture',
      '8',
      '#fdfbf7',
      '#0f172a',
      '#0e7490',
    ),
    back: createPageDataUrl(
      'THE END',
      'Reusable NPM Package',
      'Back',
      '#1e1b4b',
      '#e0e7ff',
      '#fbbf24',
      true,
    ),
  },
];
