import type { ImageSize, Quality } from './openai';

export interface StylePreset {
  id: string;
  name: string;
  /** appended to the user's prompt to steer the model */
  modifier: string;
}

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: 'none',
    name: 'No.00 — Verbatim',
    modifier: '',
  },
  {
    id: 'risograph',
    name: 'No.01 — Risograph',
    modifier:
      'rendered as a risograph print, limited spot-colour palette, visible halftone grain, slight ink misregistration, flat layered shapes',
  },
  {
    id: 'ink-wash',
    name: 'No.02 — Ink Wash',
    modifier:
      'painted as a loose sumi-e ink wash illustration, expressive brushstrokes, soft bleeding edges, generous negative space, monochrome with a single accent',
  },
  {
    id: 'midcentury',
    name: 'No.03 — Mid-Century',
    modifier:
      'mid-century modern editorial illustration, geometric simplified forms, muted earthy palette, textured paper grain, 1950s storybook feel',
  },
  {
    id: 'engraving',
    name: 'No.04 — Engraving',
    modifier:
      'detailed vintage line engraving, fine cross-hatching, antique scientific-plate aesthetic, monochrome ink on aged paper',
  },
  {
    id: 'cyan-blueprint',
    name: 'No.05 — Blueprint',
    modifier:
      'technical blueprint illustration, white line drawing on deep cyan ground, annotation marks, drafting precision',
  },
  {
    id: 'gouache',
    name: 'No.06 — Gouache',
    modifier:
      'soft gouache painting, matte opaque brushwork, gentle gradients, warm tactile palette, children-book picture-plate quality',
  },
];

export const SIZES: { id: ImageSize; label: string; ratio: string }[] = [
  { id: '1024x1024', label: 'Square', ratio: '1 : 1' },
  { id: '1024x1536', label: 'Portrait', ratio: '2 : 3' },
  { id: '1536x1024', label: 'Landscape', ratio: '3 : 2' },
];

export const QUALITIES: { id: Quality; label: string }[] = [
  { id: 'low', label: 'Draft' },
  { id: 'medium', label: 'Standard' },
  { id: 'high', label: 'Fine' },
];

export interface Plate {
  id: string;
  url: string;
  prompt: string;
  styleName: string;
  size: ImageSize;
  createdAt: number;
}
