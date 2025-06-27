import React, { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export interface Theme {
  id: string;
  name: string;
  description: string;
  mode: 'light' | 'dark';
  baseTheme: string;
  colors: {
    background: string;
    surface: string;
    surfaceHover: string;
    surfaceActive: string;
    border: string;
    borderHover: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    accent: string;
    accentHover: string;
    accentText: string;
  };
  // Add title bar color for browser theming
  titleBarColor: string;
}

export const themes: Theme[] = [
  // FREE THEMES - Arctic Series (formerly Platinum) - Classic neutral with blue accent
  {
    id: 'arctic-light',
    name: 'Arctic',
    description: 'Pure elegance',
    mode: 'light',
    baseTheme: 'arctic',
    titleBarColor: '#ffffff',
    colors: {
      background: 'bg-white',
      surface: 'bg-gray-50',
      surfaceHover: 'hover:bg-gray-100',
      surfaceActive: 'bg-gray-100',
      border: 'border-gray-200',
      borderHover: 'hover:border-gray-300',
      text: 'text-gray-900',
      textSecondary: 'text-gray-700',
      textMuted: 'text-gray-500',
      accent: 'bg-blue-600',
      accentHover: 'hover:bg-blue-700',
      accentText: 'text-white'
    }
  },
  {
    id: 'arctic-dark',
    name: 'Arctic',
    description: 'Pure elegance',
    mode: 'dark',
    baseTheme: 'arctic',
    titleBarColor: '#111827',
    colors: {
      background: 'bg-gray-900',
      surface: 'bg-gray-800',
      surfaceHover: 'hover:bg-gray-700',
      surfaceActive: 'bg-gray-700',
      border: 'border-gray-700',
      borderHover: 'hover:border-gray-600',
      text: 'text-gray-100',
      textSecondary: 'text-gray-300',
      textMuted: 'text-gray-400',
      accent: 'bg-blue-500',
      accentHover: 'hover:bg-blue-600',
      accentText: 'text-blue-50'
    }
  },

  // FREE THEMES - Studio Series (formerly Clay/Champagne) - Warm creative workspace
  {
    id: 'studio-light',
    name: 'Studio',
    description: 'Creative workspace',
    mode: 'light',
    baseTheme: 'studio',
    titleBarColor: '#ece9e2',
    colors: {
      background: 'bg-[#ece9e2]',     // Your lightest color - main background
      surface: 'bg-[#d8d4c1]',        // Second lightest - cards/surfaces
      surfaceHover: 'hover:bg-[#bfb8a7]', // Third color - hover states
      surfaceActive: 'bg-[#bfb8a7]',  // Third color - active states
      border: 'border-[#c0bebb]',     // Fourth color - borders
      borderHover: 'hover:border-[#a19f9a]', // Fifth color - border hovers
      text: 'text-[#302e2f]',         // Darkest color - main text
      textSecondary: 'text-[#302e2f]', // Darkest color - secondary text
      textMuted: 'text-[#a19f9a]',    // Fifth color - muted text
      accent: 'bg-[#b25e43]',         // NEW: Your terracotta color - accent elements
      accentHover: 'hover:bg-[#9d5139]', // Darker terracotta - accent hover
      accentText: 'text-white'        // White text on terracotta accents
    }
  },
  {
    id: 'studio-dark',
    name: 'Studio',
    description: 'Creative workspace',
    mode: 'dark',
    baseTheme: 'studio',
    titleBarColor: '#242424',
    colors: {
      background: 'bg-[#242424]',     // Your darkest color - main background
      surface: 'bg-[#1a1a1a]',        // BLACK SURFACE - no more white!
      surfaceHover: 'hover:bg-black', // PURE BLACK HOVER - creates perfect black shadow effect
      surfaceActive: 'bg-[#2a2a2a]',  // Dark active state - no white
      border: 'border-[#6b6b69]',     // Your fourth color - borders
      borderHover: 'hover:border-[#c5bebb]', // Your lightest dark color - border hovers
      text: 'text-[#c5bebb]',         // Your lightest dark color - main text
      textSecondary: 'text-[#c5bebb]', // Your lightest dark color - secondary text
      textMuted: 'text-[#6b6b69]',    // Your fourth color - muted text
      accent: 'bg-[#a66044]',         // Your terracotta-like color - accent elements
      accentHover: 'hover:bg-[#c07555]', // Lighter version for hover
      accentText: 'text-white'        // White text on terracotta accents
    }
  },

  // NEW PLATINUM THEME - Sophisticated neutrals with LIGHT TITLE BAR, WHITE UI TEXT
  {
    id: 'platinum-light',
    name: 'Platinum',
    description: 'Refined sophistication',
    mode: 'light',
    baseTheme: 'platinum',
    titleBarColor: '#fbfbfb',
    colors: {
      background: 'bg-[#fbfbfb]',     // Main background - your lightest
      surface: 'bg-[#fafafa]',        // Cards/surfaces - second lightest
      surfaceHover: 'hover:bg-[#e3d9de]', // Hover states - warm neutral
      surfaceActive: 'bg-[#e3d9de]',  // Active states - warm neutral
      border: 'border-[#dcdbdc]',     // Borders - soft gray
      borderHover: 'hover:border-[#cfd0d2]', // Border hovers - medium gray
      text: 'text-[#2f2f2f]',         // Main text - dark gray
      textSecondary: 'text-[#2c2c2c]', // Secondary text - slightly darker
      textMuted: 'text-[#7b7b7b]',    // Muted text - medium gray
      accent: 'bg-[#515559]',         // Accent - sophisticated dark gray
      accentHover: 'hover:bg-[#30302f]', // Accent hover - darker
      accentText: 'text-white'        // White text on dark accents
    }
  },
  {
    id: 'platinum-dark',
    name: 'Platinum',
    description: 'Refined sophistication',
    mode: 'dark',
    baseTheme: 'platinum',
    titleBarColor: '#fbfbfb',        // LIGHT TITLE BAR COLOR (for black title bar text)
    colors: {
      background: 'bg-[#040404]',     // Your deepest black - main background
      surface: 'bg-[#2d2d2d]',        // Your primary dark surface
      surfaceHover: 'hover:bg-[#313131]', // Hover states - slightly lighter
      surfaceActive: 'bg-[#343334]',  // Active states - medium dark
      border: 'border-[#555554]',     // Borders - medium gray
      borderHover: 'hover:border-[#6a6a6a]', // Border hovers - lighter gray
      text: 'text-[#e7e7e7]',         // WHITE UI TEXT (reverted back to original)
      textSecondary: 'text-[#d5d5d5]', // WHITE SECONDARY TEXT (reverted back to original)
      textMuted: 'text-[#9c9c9b]',    // Muted text - medium gray
      accent: 'bg-[#c2c4c6]',         // Accent - light gray for contrast
      accentHover: 'hover:bg-[#bebebe]', // Accent hover - slightly darker
      accentText: 'text-[#0e0c0a]'    // Very dark text on light accents
    }
  },

  // NEW CARBON THEME - Modern precision with CUSTOM DARK MODE HEX COLORS
  {
    id: 'carbon-light',
    name: 'Carbon',
    description: 'Modern precision',
    mode: 'light',
    baseTheme: 'carbon',
    titleBarColor: '#f9f9f9',
    colors: {
      background: 'bg-[#f9f9f9]',     // Main background - lightest gray
      surface: 'bg-[#f7f7f8]',        // Cards/surfaces - very light gray
      surfaceHover: 'hover:bg-[#f8f8f8]', // Hover states - subtle variation
      surfaceActive: 'bg-[#f7f7f7]',  // Active states - clean white-gray
      border: 'border-[#d0d0d0]',     // Borders - medium light gray
      borderHover: 'hover:border-[#c6c5c3]', // Border hovers - slightly darker
      text: 'text-[#2d2d2d]',         // Main text - dark charcoal
      textSecondary: 'text-[#2f2f2f]', // Secondary text - similar dark
      textMuted: 'text-[#a1a1a1]',    // Muted text - medium gray
      accent: 'bg-[#7178cb]',         // Accent - Linear's signature purple-blue
      accentHover: 'hover:bg-[#438fdc]', // Accent hover - Linear's blue
      accentText: 'text-white'        // White text on colored accents
    }
  },
  {
    id: 'carbon-dark',
    name: 'Carbon',
    description: 'Modern precision',
    mode: 'dark',
    baseTheme: 'carbon',
    titleBarColor: '#0d0d0d',
    colors: {
      background: 'bg-[#0d0d0d]',     // #0d0d0d - Deep black background
      surface: 'bg-[#121313]',        // #121313 - Primary surface color
      surfaceHover: 'hover:bg-[#2c3434]', // #2c3434 - Hover states
      surfaceActive: 'bg-[#2d2d2d]',  // #2d2d2d - Active states
      border: 'border-[#3b3b3c]',     // #3b3b3c - Border color
      borderHover: 'hover:border-[#656667]', // #656667 - Border hover
      text: 'text-[#e8e8e9]',         // #e8e8e9 - Primary text (brightest)
      textSecondary: 'text-[#c4c5c5]', // #c4c5c5 - Secondary text
      textMuted: 'text-[#656567]',    // #656567 - Muted text
      accent: 'bg-[#5d68be]',         // #5d68be - Primary accent (purple-blue)
      accentHover: 'hover:bg-[#646bbd]', // #646bbd - Accent hover
      accentText: 'text-white'        // White text on accent
    }
  }
];

// Group themes by base theme for the UI
export const groupedThemes = themes.reduce((acc, theme) => {
  if (!acc[theme.baseTheme]) {
    acc[theme.baseTheme] = [];
  }
  acc[theme.baseTheme].push(theme);
  return acc;
}, {} as Record<string, Theme[]>);

// Function to adjust theme intensity with proper color mapping (NO TRANSPARENCY)
export function adjustThemeIntensity(theme: Theme, intensity: number): Theme {
  // Create a deep copy of the theme
  const adjustedTheme = JSON.parse(JSON.stringify(theme));
  
  // Intensity mapping for different levels - NO TRANSPARENCY, ONLY SOLID COLORS
  if (theme.mode === 'light') {
    // Light theme intensity adjustments
    if (intensity === 25) { // Gentle - very soft, neutral
      if (theme.baseTheme === 'studio') {
        adjustedTheme.colors = {
          ...adjustedTheme.colors,
          background: 'bg-[#f2f0eb]',     // Lighter version of your palette
          surface: 'bg-[#e8e4d9]',        // Lighter surface
          surfaceHover: 'hover:bg-[#ddd8cd]', // Gentle hover
          surfaceActive: 'bg-[#ddd8cd]',  // Gentle active
          border: 'border-[#d5d2cd]',     // Soft border
          borderHover: 'hover:border-[#c8c5c0]', // Soft border hover
          text: 'text-[#4a4748]',         // Lighter text for gentle mode
          textSecondary: 'text-[#4a4748]',
          textMuted: 'text-[#b5b3ae]',    // Lighter muted text
          accent: 'bg-[#c97a65]',         // Lighter terracotta for gentle mode
          accentHover: 'hover:bg-[#b25e43]', // Your original terracotta
          accentText: 'text-white'
        };
        adjustedTheme.titleBarColor = '#f2f0eb';
      } else if (theme.baseTheme === 'platinum') {
        adjustedTheme.colors = {
          ...adjustedTheme.colors,
          background: 'bg-[#fdfdfd]',     // Even lighter
          surface: 'bg-[#fcfcfc]',        // Very light surface
          surfaceHover: 'hover:bg-[#f0f0f0]', // Gentle hover
          surfaceActive: 'bg-[#f0f0f0]',  // Gentle active
          border: 'border-[#e8e8e8]',     // Very soft border
          borderHover: 'hover:border-[#e0e0e0]', // Soft border hover
          text: 'text-[#4a4a4a]',         // Lighter text
          textSecondary: 'text-[#4a4a4a]',
          textMuted: 'text-[#9a9a9a]',    // Lighter muted
          accent: 'bg-[#6a6a6e]',         // Lighter accent
          accentHover: 'hover:bg-[#515559]', // Original accent
          accentText: 'text-white'
        };
        adjustedTheme.titleBarColor = '#fdfdfd';
      } else if (theme.baseTheme === 'carbon') {
        adjustedTheme.colors = {
          ...adjustedTheme.colors,
          background: 'bg-[#fcfcfc]',     // Even lighter than base
          surface: 'bg-[#fafafa]',        // Very light surface
          surfaceHover: 'hover:bg-[#f5f5f5]', // Gentle hover
          surfaceActive: 'bg-[#f5f5f5]',  // Gentle active
          border: 'border-[#e0e0e0]',     // Very soft border
          borderHover: 'hover:border-[#d5d5d5]', // Soft border hover
          text: 'text-[#4a4a4a]',         // Lighter text for gentle mode
          textSecondary: 'text-[#4a4a4a]',
          textMuted: 'text-[#b5b5b5]',    // Lighter muted text
          accent: 'bg-[#8a91d4]',         // Lighter purple-blue
          accentHover: 'hover:bg-[#6b9ee5]', // Lighter blue
          accentText: 'text-white'
        };
        adjustedTheme.titleBarColor = '#fcfcfc';
      } else if (theme.baseTheme === 'arctic') {
        adjustedTheme.colors = {
          ...adjustedTheme.colors,
          background: 'bg-gray-25',
          surface: 'bg-gray-50',
          surfaceHover: 'hover:bg-gray-100',
          surfaceActive: 'bg-gray-100',
          border: 'border-gray-100',
          borderHover: 'hover:border-gray-200',
          text: 'text-gray-700',
          textSecondary: 'text-gray-600',
          textMuted: 'text-gray-400'
        };
        adjustedTheme.titleBarColor = '#fafafa';
      }
    } else if (intensity === 50) { // Soft - balanced
      if (theme.baseTheme === 'studio') {
        adjustedTheme.colors = {
          ...adjustedTheme.colors,
          background: 'bg-[#efebe4]',     // Slightly lighter than original
          surface: 'bg-[#e0dccf]',        // Blend between your colors
          surfaceHover: 'hover:bg-[#d0c9b8]', // Soft hover
          surfaceActive: 'bg-[#d0c9b8]',  // Soft active
          border: 'border-[#cac7c2]',     // Soft border
          borderHover: 'hover:border-[#b8b5b0]', // Soft border hover
          text: 'text-[#3a3839]',         // Slightly lighter text
          textSecondary: 'text-[#3a3839]',
          textMuted: 'text-[#a8a6a1]',    // Soft muted text
          accent: 'bg-[#b86c54]',         // Slightly lighter terracotta
          accentHover: 'hover:bg-[#a55a47]', // Slightly darker terracotta
          accentText: 'text-white'
        };
        adjustedTheme.titleBarColor = '#efebe4';
      } else if (theme.baseTheme === 'platinum') {
        adjustedTheme.colors = {
          ...adjustedTheme.colors,
          background: 'bg-[#fcfcfc]',     // Slightly lighter
          surface: 'bg-[#fbfbfb]',        // Slightly lighter surface
          surfaceHover: 'hover:bg-[#f0e8ed]', // Soft hover
          surfaceActive: 'bg-[#f0e8ed]',  // Soft active
          border: 'border-[#e8e7e8]',     // Soft border
          borderHover: 'hover:border-[#d8d7d8]', // Soft border hover
          text: 'text-[#3f3f3f]',         // Slightly lighter text
          textSecondary: 'text-[#3c3c3c]',
          textMuted: 'text-[#8b8b8b]',    // Soft muted
          accent: 'bg-[#616165]',         // Slightly lighter accent
          accentHover: 'hover:bg-[#40403f]', // Soft accent hover
          accentText: 'text-white'
        };
        adjustedTheme.titleBarColor = '#fcfcfc';
      } else if (theme.baseTheme === 'carbon') {
        adjustedTheme.colors = {
          ...adjustedTheme.colors,
          background: 'bg-[#fafafa]',     // Slightly lighter than base
          surface: 'bg-[#f8f8f8]',        // Soft surface
          surfaceHover: 'hover:bg-[#f3f3f3]', // Soft hover
          surfaceActive: 'bg-[#f3f3f3]',  // Soft active
          border: 'border-[#d8d8d8]',     // Soft border
          borderHover: 'hover:border-[#cdcdcd]', // Soft border hover
          text: 'text-[#3a3a3a]',         // Slightly lighter text
          textSecondary: 'text-[#3a3a3a]',
          textMuted: 'text-[#ababab]',    // Soft muted text
          accent: 'bg-[#7e85d1]',         // Slightly lighter purple-blue
          accentHover: 'hover:bg-[#5a9de1]', // Soft blue
          accentText: 'text-white'
        };
        adjustedTheme.titleBarColor = '#fafafa';
      } else if (theme.baseTheme === 'arctic') {
        adjustedTheme.colors = {
          ...adjustedTheme.colors,
          background: 'bg-gray-50',
          surface: 'bg-gray-100',
          surfaceHover: 'hover:bg-gray-150',
          surfaceActive: 'bg-gray-150',
          border: 'border-gray-150',
          borderHover: 'hover:border-gray-200',
          text: 'text-gray-800',
          textSecondary: 'text-gray-650',
          textMuted: 'text-gray-450'
        };
        adjustedTheme.titleBarColor = '#f9fafb';
      }
    } else if (intensity === 100) { // Intense - enhanced saturation
      if (theme.baseTheme === 'studio') {
        adjustedTheme.colors = {
          ...adjustedTheme.colors,
          background: 'bg-[#e9e6df]',     // Slightly darker than original
          surface: 'bg-[#d0ccbf]',        // Darker surface
          surfaceHover: 'hover:bg-[#b7b09f]', // Stronger hover
          surfaceActive: 'bg-[#b7b09f]',  // Stronger active
          border: 'border-[#b8b5b0]',     // Stronger border
          borderHover: 'hover:border-[#999792]', // Stronger border hover
          text: 'text-[#1f1d1e]',         // Even darker text for intensity
          textSecondary: 'text-[#1f1d1e]',
          textMuted: 'text-[#8a8885]',    // Darker muted text
          accent: 'bg-[#a04d32]',         // Deeper, more intense terracotta
          accentHover: 'hover:bg-[#8b4229]', // Very deep terracotta
          accentText: 'text-white'
        };
        adjustedTheme.titleBarColor = '#e9e6df';
      } else if (theme.baseTheme === 'platinum') {
        adjustedTheme.colors = {
          ...adjustedTheme.colors,
          background: 'bg-[#f9f9f9]',     // Slightly darker
          surface: 'bg-[#f6f6f6]',        // Darker surface
          surfaceHover: 'hover:bg-[#ddd4d9]', // Stronger hover
          surfaceActive: 'bg-[#ddd4d9]',  // Stronger active
          border: 'border-[#d0cfdd]',     // Stronger border
          borderHover: 'hover:border-[#c0bfc2]', // Stronger border hover
          text: 'text-[#1f1f1f]',         // Darker text for intensity
          textSecondary: 'text-[#1c1c1c]',
          textMuted: 'text-[#6b6b6b]',    // Darker muted
          accent: 'bg-[#414145]',         // Deeper accent
          accentHover: 'hover:bg-[#20201f]', // Very deep accent
          accentText: 'text-white'
        };
        adjustedTheme.titleBarColor = '#f9f9f9';
      } else if (theme.baseTheme === 'carbon') {
        adjustedTheme.colors = {
          ...adjustedTheme.colors,
          background: 'bg-[#f7f7f7]',     // Slightly darker than base
          surface: 'bg-[#f5f5f5]',        // Darker surface
          surfaceHover: 'hover:bg-[#eeeeee]', // Stronger hover
          surfaceActive: 'bg-[#eeeeee]',  // Stronger active
          border: 'border-[#c4c4c4]',     // Stronger border
          borderHover: 'hover:border-[#bcbcbc]', // Stronger border hover
          text: 'text-[#1a1a1a]',         // Darker text for intensity
          textSecondary: 'text-[#1a1a1a]',
          textMuted: 'text-[#8a8a8a]',    // Darker muted text
          accent: 'bg-[#5d64b8]',         // Deeper, more intense purple-blue
          accentHover: 'hover:bg-[#2f7bc9]', // Deeper blue
          accentText: 'text-white'
        };
        adjustedTheme.titleBarColor = '#f7f7f7';
      }
    }
  } else {
    // Dark theme intensity adjustments - UPDATED FOR PLATINUM WITH LIGHT TITLE BAR, WHITE UI TEXT
    if (intensity === 25) { // Gentle - lighter dark mode
      if (theme.baseTheme === 'studio') {
        adjustedTheme.colors = {
          ...adjustedTheme.colors,
          background: 'bg-[#3a3a3a]',     // Lighter than your darkest
          surface: 'bg-[#2a2a2a]',        // BLACK SURFACE - no white
          surfaceHover: 'hover:bg-black', // BLACK HOVER for gentle mode too
          surfaceActive: 'bg-[#3a3a3a]',  // Dark active - no white
          border: 'border-[#7a7a78]',     // Lighter border
          borderHover: 'hover:border-[#9a9a98]', // Even lighter border hover
          text: 'text-[#d5d0cb]',         // Lighter text
          textSecondary: 'text-[#d5d0cb]',
          textMuted: 'text-[#8b8b89]',    // Lighter muted text
          accent: 'bg-[#c07555]',         // Lighter terracotta for gentle dark
          accentHover: 'hover:bg-[#d68770]',
          accentText: 'text-white'
        };
        adjustedTheme.titleBarColor = '#3a3a3a';
      } else if (theme.baseTheme === 'platinum') {
        adjustedTheme.colors = {
          ...adjustedTheme.colors,
          background: 'bg-[#1c1c1c]',     // Lighter than deepest black
          surface: 'bg-[#343334]',        // Lighter surface
          surfaceHover: 'hover:bg-[#3c3c3b]', // Gentle hover
          surfaceActive: 'bg-[#3c3c3b]',  // Gentle active
          border: 'border-[#6a6a6a]',     // Lighter border
          borderHover: 'hover:border-[#9c9c9b]', // Lighter border hover
          text: 'text-[#e7e7e7]',         // WHITE UI TEXT (keep original)
          textSecondary: 'text-[#d5d5d5]', // WHITE SECONDARY TEXT (keep original)
          textMuted: 'text-[#bdbdbd]',    // Lighter muted
          accent: 'bg-[#c2c4c6]',         // Light accent
          accentHover: 'hover:bg-[#bebebe]', // Gentle accent hover
          accentText: 'text-[#25201b]'    // Dark text on light accent
        };
        adjustedTheme.titleBarColor = '#fdfdfd'; // Light title bar for gentle
      } else if (theme.baseTheme === 'carbon') {
        adjustedTheme.colors = {
          ...adjustedTheme.colors,
          background: 'bg-[#1f2024]',     // #1f2024 - Lighter background for gentle
          surface: 'bg-[#2b2b2c]',        // #2b2b2c - Lighter surface
          surfaceHover: 'hover:bg-[#363738]', // #363738 - Gentle hover
          surfaceActive: 'bg-[#353535]',  // #353535 - Gentle active
          border: 'border-[#4b4c4c]',     // #4b4c4c - Lighter border
          borderHover: 'hover:border-[#666767]', // #666767 - Gentle border hover
          text: 'text-[#c9cbcf]',         // #c9cbcf - Lighter text
          textSecondary: 'text-[#b2b3bb]', // #b2b3bb - Lighter secondary text
          textMuted: 'text-[#838384]',    // #838384 - Lighter muted text
          accent: 'bg-[#646bbd]',         // #646bbd - Lighter accent
          accentHover: 'hover:bg-[#5d68be]', // Original accent for hover
          accentText: 'text-white'
        };
        adjustedTheme.titleBarColor = '#1f2024';
      } else if (theme.baseTheme === 'arctic') {
        adjustedTheme.colors = {
          ...adjustedTheme.colors,
          background: 'bg-gray-600',
          surface: 'bg-gray-500',
          surfaceHover: 'hover:bg-gray-400',
          surfaceActive: 'bg-gray-400',
          border: 'border-gray-400',
          borderHover: 'hover:border-gray-300',
          text: 'text-gray-50',
          textSecondary: 'text-gray-100',
          textMuted: 'text-gray-200'
        };
        adjustedTheme.titleBarColor = '#4b5563';
      }
    } else if (intensity === 50) { // Soft - balanced dark
      if (theme.baseTheme === 'studio') {
        adjustedTheme.colors = {
          ...adjustedTheme.colors,
          background: 'bg-[#2e2e2e]',     // Between gentle and standard
          surface: 'bg-[#1e1e1e]',        // BLACK SURFACE - no white
          surfaceHover: 'hover:bg-black', // BLACK HOVER for soft mode
          surfaceActive: 'bg-[#2e2e2e]',  // Dark active - no white
          border: 'border-[#6e6e6c]',     // Balanced border
          borderHover: 'hover:border-[#aeaea8]', // Soft border hover
          text: 'text-[#cac5c0]',         // Balanced text
          textSecondary: 'text-[#cac5c0]',
          textMuted: 'text-[#7e7e7c]',    // Balanced muted text
          accent: 'bg-[#b56b50]',         // Balanced terracotta
          accentHover: 'hover:bg-[#c97862]',
          accentText: 'text-white'
        };
        adjustedTheme.titleBarColor = '#2e2e2e';
      } else if (theme.baseTheme === 'platinum') {
        adjustedTheme.colors = {
          ...adjustedTheme.colors,
          background: 'bg-[#080707]',     // Between deepest and standard
          surface: 'bg-[#2c2a28]',        // Balanced surface
          surfaceHover: 'hover:bg-[#353332]', // Soft hover
          surfaceActive: 'bg-[#353332]',  // Soft active
          border: 'border-[#575755]',     // Balanced border
          borderHover: 'hover:border-[#b0b0af]', // Soft border hover
          text: 'text-[#e7e7e7]',         // WHITE UI TEXT (keep original)
          textSecondary: 'text-[#d5d5d5]', // WHITE SECONDARY TEXT (keep original)
          textMuted: 'text-[#9c9c9b]',    // Balanced muted
          accent: 'bg-[#c2c4c6]',         // Light accent
          accentHover: 'hover:bg-[#bebebe]', // Soft accent hover
          accentText: 'text-[#25201a]'    // Dark text on light accent
        };
        adjustedTheme.titleBarColor = '#fcfcfc'; // Light title bar for soft
      } else if (theme.baseTheme === 'carbon') {
        adjustedTheme.colors = {
          ...adjustedTheme.colors,
          background: 'bg-[#0d1212]',     // #0d1212 - Balanced background
          surface: 'bg-[#131314]',        // #131314 - Balanced surface
          surfaceHover: 'hover:bg-[#2c2b2c]', // #2c2b2c - Soft hover
          surfaceActive: 'bg-[#434344]',  // #434344 - Soft active
          border: 'border-[#615f62]',     // #615f62 - Balanced border
          borderHover: 'hover:border-[#b0b0b0]', // #b0b0b0 - Soft border hover
          text: 'text-[#e8e8e9]',         // Keep bright text
          textSecondary: 'text-[#c4c5c5]',
          textMuted: 'text-[#656567]',    // Keep original muted
          accent: 'bg-[#5d68be]',         // Keep original accent
          accentHover: 'hover:bg-[#646bbd]', // Soft accent hover
          accentText: 'text-white'
        };
        adjustedTheme.titleBarColor = '#0d1212';
      } else if (theme.baseTheme === 'arctic') {
        adjustedTheme.colors = {
          ...adjustedTheme.colors,
          background: 'bg-gray-700',
          surface: 'bg-gray-600',
          surfaceHover: 'hover:bg-gray-500',
          surfaceActive: 'bg-gray-500',
          border: 'border-gray-500',
          borderHover: 'hover:border-gray-400',
          text: 'text-gray-50',
          textSecondary: 'text-gray-150',
          textMuted: 'text-gray-250'
        };
        adjustedTheme.titleBarColor = '#374151';
      }
    } else if (intensity === 100) { // Intense - deepest dark
      if (theme.baseTheme === 'studio') {
        adjustedTheme.colors = {
          ...adjustedTheme.colors,
          background: 'bg-[#1a1a1a]',     // Even darker than your darkest
          surface: 'bg-[#0a0a0a]',        // VERY BLACK SURFACE - no white
          surfaceHover: 'hover:bg-black', // BLACK HOVER for intense mode
          surfaceActive: 'bg-[#1a1a1a]',  // Dark active - no white
          border: 'border-[#555553]',     // Deeper border
          borderHover: 'hover:border-[#757573]', // Intense border hover
          text: 'text-[#e5e0db]',         // Brighter text for contrast
          textSecondary: 'text-[#e5e0db]',
          textMuted: 'text-[#555553]',    // Deeper muted text
          accent: 'bg-[#954d35]',         // Deeper, more intense terracotta
          accentHover: 'hover:bg-[#a85a42]',
          accentText: 'text-white'
        };
        adjustedTheme.titleBarColor = '#1a1a1a';
      } else if (theme.baseTheme === 'platinum') {
        adjustedTheme.colors = {
          ...adjustedTheme.colors,
          background: 'bg-[#0e0c0a]',     // Your deepest dark color
          surface: 'bg-[#232424]',        // Deep surface
          surfaceHover: 'hover:bg-[#2b2a29]', // Intense hover
          surfaceActive: 'bg-[#2b2a29]',  // Intense active
          border: 'border-[#504f4d]',     // Deep border
          borderHover: 'hover:border-[#c1c1c1]', // Intense border hover
          text: 'text-[#e7e7e7]',         // WHITE UI TEXT (keep original)
          textSecondary: 'text-[#d5d5d5]', // WHITE SECONDARY TEXT (keep original)
          textMuted: 'text-[#52514f]',    // Deep muted
          accent: 'bg-[#babab9]',         // Bright accent for contrast
          accentHover: 'hover:bg-[#c1c1c1]', // Intense accent hover
          accentText: 'text-[#0e0d0a]'    // Very dark text on bright accent
        };
        adjustedTheme.titleBarColor = '#fbfbfb'; // Light title bar for intense
      } else if (theme.baseTheme === 'carbon') {
        adjustedTheme.colors = {
          ...adjustedTheme.colors,
          background: 'bg-[#0d0d0d]',     // Keep deepest background
          surface: 'bg-[#121313]',        // Keep original surface
          surfaceHover: 'hover:bg-[#2c3434]', // Keep original hover
          surfaceActive: 'bg-[#2d2d2d]',  // Keep original active
          border: 'border-[#3b3b3c]',     // Keep original border
          borderHover: 'hover:border-[#656667]', // Keep original border hover
          text: 'text-[#e8e8e9]',         // Keep brightest text
          textSecondary: 'text-[#c4c5c5]', // Keep original secondary
          textMuted: 'text-[#656567]',    // Keep original muted
          accent: 'bg-[#5d68be]',         // Keep original accent
          accentHover: 'hover:bg-[#646bbd]', // Keep original accent hover
          accentText: 'text-white'        // Keep white text
        };
        adjustedTheme.titleBarColor = '#0d0d0d';
      }
    }
  }
  
  return adjustedTheme;
}

interface ThemeContextType {
  currentTheme: Theme;
  themeIntensity: number;
  setTheme: (themeId: string) => void;
  setThemeIntensity: (intensity: number) => void;
  themes: Theme[];
  groupedThemes: Record<string, Theme[]>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentThemeId, setCurrentThemeId] = useLocalStorage<string>('notion-theme', 'studio-light');
  const [themeIntensity, setThemeIntensityState] = useLocalStorage<number>('theme-intensity', 75);
  
  // Handle migration from old theme names (including amber)
  const migrateThemeId = (themeId: string) => {
    const migrations: Record<string, string> = {
      'champagne-light': 'studio-light',
      'champagne-dark': 'studio-dark',
      'clay-light': 'studio-light',
      'clay-dark': 'studio-dark',
      'warm-light': 'studio-light',
      'warm-dark': 'studio-dark',
      'graphite-light': 'arctic-light',
      'graphite-dark': 'arctic-dark',
      'frost-light': 'arctic-light',
      'frost-dark': 'arctic-dark',
      'clean-light': 'arctic-light',
      'clean-dark': 'arctic-dark',
      'forest-light': 'arctic-light',
      'forest-dark': 'arctic-dark',
      // Migrate amber themes to studio
      'amber-light': 'studio-light',
      'amber-dark': 'studio-dark'
    };
    return migrations[themeId] || themeId;
  };
  
  const validThemeId = migrateThemeId(currentThemeId);
  const baseTheme = themes.find(theme => theme.id === validThemeId) || themes.find(theme => theme.id === 'studio-light') || themes[0];
  const currentTheme = adjustThemeIntensity(baseTheme, themeIntensity);

  const setTheme = (themeId: string) => {
    setCurrentThemeId(themeId);
  };

  const setThemeIntensity = (intensity: number) => {
    setThemeIntensityState(intensity);
  };

  // Apply theme to document root for global styles AND update title bar color
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all existing theme classes
    themes.forEach(theme => {
      root.classList.remove(`theme-${theme.id}`);
    });
    
    // Add current theme class
    root.classList.add(`theme-${currentTheme.id}`);
    
    // Add intensity class for additional styling if needed
    root.setAttribute('data-theme-intensity', themeIntensity.toString());
    
    // UPDATE TITLE BAR COLOR
    const updateTitleBarColor = () => {
      console.log(`🎨 UPDATING TITLE BAR COLOR TO: ${currentTheme.titleBarColor} for theme: ${currentTheme.id}`);
      
      // FORCE UPDATE ALL META TAGS
      const metaTags = [
        { name: 'theme-color', content: currentTheme.titleBarColor },
        { name: 'msapplication-navbutton-color', content: currentTheme.titleBarColor },
        { name: 'apple-mobile-web-app-status-bar-style', content: currentTheme.mode === 'dark' ? 'black-translucent' : 'default' }
      ];

      metaTags.forEach(({ name, content }) => {
        // Remove existing meta tag
        const existingMeta = document.querySelector(`meta[name="${name}"]`);
        if (existingMeta) {
          existingMeta.remove();
        }
        
        // Create new meta tag
        const newMeta = document.createElement('meta');
        newMeta.setAttribute('name', name);
        newMeta.setAttribute('content', content);
        document.head.appendChild(newMeta);
        
        console.log(`✅ Created meta tag: ${name} = ${content}`);
      });

      // FORCE BROWSER TO RECOGNIZE THE CHANGE
      document.body.style.display = 'none';
      document.body.offsetHeight; // Trigger reflow
      document.body.style.display = '';
    };

    // Update immediately and with delays
    updateTitleBarColor();
    setTimeout(updateTitleBarColor, 50);
    setTimeout(updateTitleBarColor, 200);
    
  }, [currentTheme, themeIntensity]);

  return (
    <ThemeContext.Provider value={{ 
      currentTheme, 
      themeIntensity, 
      setTheme, 
      setThemeIntensity, 
      themes, 
      groupedThemes 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}