# Slip - Beautiful Note Taking

A modern, elegant note-taking application with theme-aware branding and beautiful design.

## Theme-Aware Logo System

This application features an intelligent logo system that automatically switches between light and dark versions to match the current theme mode:

### How It Works

1. **Theme Mode Matching**: The logo matches the current theme mode
2. **Smart Selection**: 
   - **Light mode** → Light logo (black text on light background)
   - **Dark mode** → Dark logo (white text on dark background)
3. **Seamless Transitions**: Logo changes smoothly when switching themes

### Logo Files Required

Place these logo files in the `public` directory:

- `slip-logo-light copy.png` - Light version with black text (for light mode)
- `slip-logo-dark copy.png` - Dark version with white text (for dark mode)

### Implementation

The `SlipLogo` component handles all the logic:

```tsx
// Automatically selects the right logo to match theme mode
const logoSrc = currentTheme.mode === 'light' 
  ? '/slip-logo-light copy.png'  // Light logo (black text) for light mode
  : '/slip-logo-dark copy.png';  // Dark logo (white text) for dark mode
```

### Fallback System

If logo images aren't found, the component gracefully falls back to an SVG version that also respects the theme colors.

### Usage

```tsx
import { SlipLogo } from './components/SlipLogo';

// Use anywhere in your app
<SlipLogo size="xl" />
```

Available sizes: `sm`, `md`, `lg`, `xl`

## Features

- ✨ Theme-aware logo system that matches mode
- 🎨 Multiple beautiful themes (Champagne, Graphite, Forest)
- 📱 Responsive design
- 🔍 Search functionality
- 📝 Rich text editing with block-based editor
- 💾 Local storage persistence
- 🎛️ Theme intensity controls

## Getting Started

1. Add your logo files to the `public` directory
2. Run `npm install`
3. Run `npm run dev`
4. Start taking beautiful notes with your branded experience!

## Theme System

The app includes three beautiful theme families:

- **Champagne**: Elegant and warm with custom color palette
- **Graphite**: Modern and sophisticated
- **Forest**: Natural and calming

Each theme has light and dark variants, and you can adjust the intensity from gentle to intense for the perfect visual experience.