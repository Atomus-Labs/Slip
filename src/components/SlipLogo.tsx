import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface SlipLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl' | 'xxxxl';
  className?: string;
}

export function SlipLogo({ size = 'md', className = '' }: SlipLogoProps) {
  const { currentTheme } = useTheme();
  
  const sizeClasses = {
    sm: 'h-4',      // Very small
    md: 'h-6',      // Small
    lg: 'h-8',      // Medium
    xl: 'h-10',     // Large
    xxl: 'h-12',    // Extra large
    xxxl: 'h-20',   // XXXL - Much bigger now!
    xxxxl: 'h-24'   // Largest
  };

  // Show logo that matches the theme mode
  const logoSrc = currentTheme.mode === 'light' 
    ? '/slip-logo-light copy.png'  // Light logo (black text) for light mode
    : '/slip-logo-dark copy.png';  // Dark logo (white text) for dark mode

  const logoAlt = `Slip Logo (${currentTheme.mode === 'light' ? 'Light' : 'Dark'} Mode)`;

  // Use same size for both light and dark mode - no more huge differences
  const actualSize = size;

  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src={logoSrc}
        alt={logoAlt}
        className={`${sizeClasses[actualSize]} w-auto object-contain transition-opacity duration-300`}
        onError={(e) => {
          // Fallback to SVG logo if images don't exist
          console.warn('Logo image not found, falling back to SVG');
          e.currentTarget.style.display = 'none';
          // Show SVG fallback
          const svgFallback = e.currentTarget.nextElementSibling as HTMLElement;
          if (svgFallback) svgFallback.style.display = 'block';
        }}
      />
      
      {/* SVG Fallback - hidden by default, shown if image fails to load */}
      <svg 
        viewBox="0 0 120 32" 
        className={`${sizeClasses[actualSize]} w-auto hidden`}
        fill="none"
      >
        {/* Double slash mark */}
        <g>
          <path
            d="M4 24 L16 8"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            className={currentTheme.mode === 'light' ? 'text-gray-900' : 'text-white'}
          />
          <path
            d="M10 24 L22 8"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            className={currentTheme.mode === 'light' ? 'text-gray-900' : 'text-white'}
          />
        </g>
        
        {/* "Slip" text */}
        <g className={currentTheme.mode === 'light' ? 'text-gray-900' : 'text-white'} fill="currentColor">
          <path d="M35 20.5 C35 18.5 36.5 17 38.5 17 L42.5 17 C44.5 17 46 18.5 46 20.5 C46 22.5 44.5 24 42.5 24 L40.5 24 C38.5 24 37 22.5 37 20.5 C37 18.5 38.5 17 40.5 17 L44.5 17 C46.5 17 48 18.5 48 20.5" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                fill="none" 
                strokeLinecap="round"/>
          <line x1="54" y1="10" x2="54" y2="24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="62" y1="17" x2="62" y2="24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="62" cy="13" r="1.5" fill="currentColor"/>
          <line x1="70" y1="17" x2="70" y2="28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M70 17 L76 17 C78 17 80 19 80 21 C80 23 78 24 76 24 L70 24" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                fill="none" 
                strokeLinecap="round"/>
        </g>
      </svg>
    </div>
  );
}