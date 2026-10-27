import { Boxes, Home, Languages, Mic, Palette, Smartphone, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { PageId } from '../types/app';

export interface NavigationItem {
  id: PageId;
  label: string;
  shortLabel: string;
  description: string;
  icon: LucideIcon;
}

export const NAVIGATION_ITEMS: readonly NavigationItem[] = [
  {
    id: 'home',
    label: 'Home',
    shortLabel: 'Home',
    description: 'Your voice workspace',
    icon: Home,
  },
  {
    id: 'voice',
    label: 'Voice Typing',
    shortLabel: 'Voice',
    description: 'Speak and watch it type',
    icon: Mic,
  },
  {
    id: 'refinement',
    label: 'Refinement',
    shortLabel: 'Refine',
    description: 'Turn thoughts into clear writing',
    icon: Sparkles,
  },
  {
    id: 'translation',
    label: 'Translation',
    shortLabel: 'Translate',
    description: 'Speak one language, write another',
    icon: Languages,
  },
  {
    id: 'models',
    label: 'Models',
    shortLabel: 'Models',
    description: 'Gateways, keys, and models',
    icon: Boxes,
  },
  {
    id: 'appearance',
    label: 'Appearance',
    shortLabel: 'Look',
    description: 'Theme, accent, and overlay',
    icon: Palette,
  },
  {
    id: 'remote',
    label: 'Remote Control',
    shortLabel: 'Remote',
    description: 'Turn your phone into a remote',
    icon: Smartphone,
  },
];

const HOME_ITEM = NAVIGATION_ITEMS.find((item) => item.id === 'home');

export function getNavigationItem(id: PageId): NavigationItem {
  if (!HOME_ITEM) {
    throw new Error('Home navigation item is missing.');
  }

  return NAVIGATION_ITEMS.find((item) => item.id === id) ?? HOME_ITEM;
}
