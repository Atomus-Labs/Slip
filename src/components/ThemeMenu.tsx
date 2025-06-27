import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check, X, Sun, Moon, Zap, Sparkles, Circle, Dot } from 'lucide-react';
import { useTheme, adjustThemeIntensity } from '../contexts/ThemeContext';

interface ThemeMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const INTENSITY_LEVELS = [
  { value: 25, label: 'Gentle', icon: Circle, description: 'Soft and subtle' },
  { value: 50, label: 'Soft', icon: Dot, description: 'Comfortable balance' },
  { value: 75, label: 'Balanced', icon: Sparkles, description: 'Standard intensity' },
  { value: 100, label: 'Intense', icon: Zap, description: 'Full saturation' }
];

export function ThemeMenu({ isOpen, onClose }: ThemeMenuProps) {
  const { 
    currentTheme, 
    themeIntensity, 
    setTheme, 
    setThemeIntensity, 
    groupedThemes, 
    themes
  } = useTheme();
  
  const menuRef = useRef<HTMLDivElement>(null);
  const [previewIntensity, setPreviewIntensity] = useState(themeIntensity);

  // Update preview intensity when theme intensity changes
  useEffect(() => {
    setPreviewIntensity(themeIntensity);
  }, [themeIntensity]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleIntensityChange = (newIntensity: number) => {
    setPreviewIntensity(newIntensity);
    setThemeIntensity(newIntensity);
  };

  const handleThemeSelect = (themeId: string) => {
    setTheme(themeId);
  };

  const currentBaseTheme = themes.find(t => t.id === currentTheme.id);
  const previewTheme = currentBaseTheme ? adjustThemeIntensity(currentBaseTheme, previewIntensity) : currentTheme;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div
        ref={menuRef}
        className={`${currentTheme.colors.surface} ${currentTheme.colors.border} border rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col`}
      >
        {/* Header */}
        <div className={`${currentTheme.colors.border} border-b p-6 flex-shrink-0`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`${currentTheme.colors.accent} p-2 rounded-lg`}>
                <Palette size={20} className={currentTheme.colors.accentText} />
              </div>
              <div>
                <h2 className={`text-xl font-semibold ${currentTheme.colors.text}`}>
                  Choose Your Theme
                </h2>
                <p className={`text-sm ${currentTheme.colors.textMuted}`}>
                  {themes.length} beautiful themes to personalize your experience
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 ${currentTheme.colors.textMuted} ${currentTheme.colors.surfaceHover} rounded-lg transition-colors duration-200 hover:scale-105`}
              title="Close theme menu"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Intensity Control */}
        <div className={`${currentTheme.colors.border} border-b p-6 flex-shrink-0`}>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className={`${currentTheme.colors.surface} p-2 rounded-lg ${currentTheme.colors.border} border`}>
                <Sparkles size={16} className={currentTheme.colors.textSecondary} />
              </div>
              <div>
                <h3 className={`font-medium ${currentTheme.colors.text}`}>
                  Theme Intensity
                </h3>
                <p className={`text-sm ${currentTheme.colors.textMuted}`}>
                  Adjust how vibrant your theme appears
                </p>
              </div>
            </div>
            
            {/* Intensity Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {INTENSITY_LEVELS.map((level) => {
                const Icon = level.icon;
                const isSelected = previewIntensity === level.value;
                
                return (
                  <button
                    key={level.value}
                    onClick={() => handleIntensityChange(level.value)}
                    className={`
                      relative p-4 rounded-xl border-2 transition-all duration-200 text-center group
                      ${isSelected
                        ? `${currentTheme.colors.accent} ${currentTheme.colors.accentText} border-transparent shadow-lg transform scale-105`
                        : `${currentTheme.colors.surface} ${currentTheme.colors.border} ${currentTheme.colors.surfaceHover} hover:shadow-md hover:scale-102`
                      }
                    `}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-white bg-opacity-20' : currentTheme.colors.background}`}>
                        <Icon 
                          size={20} 
                          className={isSelected ? 'text-current' : currentTheme.colors.textSecondary} 
                        />
                      </div>
                      <div>
                        <div className={`font-medium text-sm ${isSelected ? 'text-current' : currentTheme.colors.text}`}>
                          {level.label}
                        </div>
                        <div className={`text-xs ${isSelected ? 'text-current opacity-80' : currentTheme.colors.textMuted}`}>
                          {level.description}
                        </div>
                      </div>
                    </div>
                    
                    {/* Selected indicator */}
                    {isSelected && (
                      <div className="absolute -top-1 -right-1">
                        <div className="bg-white p-1 rounded-full shadow-md">
                          <Check size={12} className={currentTheme.colors.accent.replace('bg-', 'text-')} />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Live Preview */}
            <div className={`${previewTheme.colors.background} rounded-xl p-4 ${previewTheme.colors.border} border transition-all duration-300`}>
              <div className="flex items-center space-x-3 mb-3">
                <div className={`w-2 h-2 ${previewTheme.colors.accent} rounded-full`} />
                <span className={`text-sm font-medium ${previewTheme.colors.text}`}>
                  Live Preview • {INTENSITY_LEVELS.find(l => l.value === previewIntensity)?.label} ({previewIntensity}%)
                </span>
              </div>
              
              <div className={`${previewTheme.colors.surface} rounded-lg p-4 border ${previewTheme.colors.border} transition-all duration-300`}>
                <div className="space-y-3">
                  <div className={`h-3 ${previewTheme.colors.accent} rounded w-3/4 transition-all duration-300`} />
                  <div className={`h-2 ${previewTheme.colors.accent} rounded w-1/2 opacity-80 transition-all duration-300`} />
                  <div className={`h-2 ${previewTheme.colors.accent} rounded w-2/3 opacity-60 transition-all duration-300`} />
                  <div className="flex space-x-2">
                    <div className={`h-6 w-16 ${previewTheme.colors.accent} rounded transition-all duration-300`} />
                    <div className={`h-6 w-12 ${previewTheme.colors.accent} rounded opacity-80 transition-all duration-300`} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Theme Groups - Flexible height with proper scroll */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-6 space-y-8 pb-8">
            {Object.entries(groupedThemes).map(([baseTheme, themeVariants]) => {
              const lightTheme = themeVariants.find(t => t.mode === 'light');
              const darkTheme = themeVariants.find(t => t.mode === 'dark');
              
              return (
                <div key={baseTheme} className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <h3 className={`text-lg font-medium ${currentTheme.colors.text}`}>
                      {lightTheme?.name || darkTheme?.name}
                    </h3>
                    <div className={`h-px flex-1 ${currentTheme.colors.border.replace('border-', 'bg-')} opacity-50`} />
                    <span className={`text-sm ${currentTheme.colors.textMuted}`}>
                      {lightTheme?.description || darkTheme?.description}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[lightTheme, darkTheme].filter(Boolean).map((theme) => (
                      <ThemeCard
                        key={theme!.id}
                        theme={theme!}
                        isSelected={theme!.id === currentBaseTheme?.id}
                        previewIntensity={previewIntensity}
                        onSelect={() => handleThemeSelect(theme!.id)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className={`${currentTheme.colors.border} border-t p-4 flex-shrink-0`}>
          <div className="flex items-center justify-between">
            <p className={`text-xs ${currentTheme.colors.textMuted}`}>
              Your theme and intensity preferences are saved automatically
            </p>
            <button
              onClick={onClose}
              className={`text-xs ${currentTheme.colors.textSecondary} ${currentTheme.colors.surfaceHover} px-3 py-1 rounded-full transition-colors duration-200 font-medium`}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Theme Card Component
interface ThemeCardProps {
  theme: any;
  isSelected: boolean;
  previewIntensity: number;
  onSelect: () => void;
}

function ThemeCard({ theme, isSelected, previewIntensity, onSelect }: ThemeCardProps) {
  const { currentTheme } = useTheme();
  const adjustedTheme = adjustThemeIntensity(theme, previewIntensity);

  return (
    <button
      onClick={onSelect}
      className={`
        relative p-4 rounded-xl border-2 transition-all duration-200 text-left group
        ${isSelected
          ? `${theme.colors.border.replace('border-', 'border-')} ${theme.colors.surfaceActive} shadow-lg ring-2 ring-opacity-20` 
          : `${theme.colors.border} ${theme.colors.surfaceHover} hover:shadow-md hover:scale-102`
        }
      `}
    >
      {/* Theme Preview */}
      <div className={`${adjustedTheme.colors.surface} border rounded-lg p-4 mb-4 relative overflow-hidden transition-all duration-300 ${adjustedTheme.colors.border}`}>
        {/* Mock content */}
        <div className="space-y-2.5">
          <div className={`h-2.5 ${adjustedTheme.colors.accent} rounded w-3/4 transition-all duration-300`} />
          <div className={`h-1.5 ${adjustedTheme.colors.accent} rounded w-1/2 opacity-80 transition-all duration-300`} />
          <div className={`h-1 ${adjustedTheme.colors.accent} rounded w-2/3 opacity-60 transition-all duration-300`} />
          <div className={`h-1 ${adjustedTheme.colors.accent} rounded w-1/3 opacity-40 transition-all duration-300`} />
        </div>
        
        {/* Mode indicator */}
        <div className="absolute top-2 right-2">
          <div className={`p-1.5 ${theme.colors.background} rounded-full shadow-sm`}>
            {theme.mode === 'light' ? (
              <Sun size={12} className={theme.colors.textMuted} />
            ) : (
              <Moon size={12} className={theme.colors.textMuted} />
            )}
          </div>
        </div>
      </div>

      {/* Theme Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {theme.mode === 'light' ? (
            <Sun size={16} className={theme.colors.textSecondary} />
          ) : (
            <Moon size={16} className={theme.colors.textSecondary} />
          )}
          <span className={`font-medium ${theme.colors.text}`}>
            {theme.mode === 'light' ? 'Light' : 'Dark'}
          </span>
        </div>
        
        {/* Selected indicator */}
        {isSelected && (
          <div className={`${theme.colors.accent} p-1 rounded-full`}>
            <Check size={12} className={theme.colors.accentText} />
          </div>
        )}
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-xl" />
    </button>
  );
}