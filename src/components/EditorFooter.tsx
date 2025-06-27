import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Editor } from '@tiptap/react';
import { Note } from '../types';

interface EditorFooterProps {
  editor: Editor | null;
  note: Note;
  wordCount: number;
  characterCount: number;
  currentMode: 'text' | 'markdown' | 'preview';
  onModeChange: (mode: 'text' | 'markdown' | 'preview') => void;
}

export function EditorFooter({ 
  editor, 
  note, 
  wordCount, 
  characterCount, 
  currentMode, 
  onModeChange 
}: EditorFooterProps) {
  const { currentTheme } = useTheme();
  const [showWordDetails, setShowWordDetails] = useState(false);

  const modes = [
    { id: 'text' as const, label: 'Text', description: 'Rich text editor' },
    { id: 'markdown' as const, label: 'Markdown', description: 'Markdown syntax' },
    ...(currentMode === 'markdown' ? [{ 
      id: 'preview' as const, 
      label: 'Preview', 
      description: 'Rendered markdown' 
    }] : [])
  ];

  return (
    <div className={`
      fixed bottom-0 left-0 right-0 z-40
      ${currentTheme.colors.surface} ${currentTheme.colors.border} border-t
      backdrop-blur-xl bg-opacity-95
    `}>
      <div className="max-w-4xl mx-auto px-8 py-3">
        <div className="flex items-center justify-between">
          
          {/* Left Section - Mode Tabs */}
          <div className="flex items-center space-x-1">
            {modes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => onModeChange(mode.id)}
                className={`
                  px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 group relative
                  ${currentMode === mode.id
                    ? `${currentTheme.colors.accent} ${currentTheme.colors.accentText} shadow-md`
                    : `${currentTheme.colors.textMuted} ${currentTheme.colors.surfaceHover} hover:${currentTheme.colors.textSecondary}`
                  }
                `}
                title={mode.description}
              >
                {mode.label}
                
                {/* Tooltip */}
                <div className={`
                  absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1
                  ${currentTheme.colors.surface} ${currentTheme.colors.border} border rounded-md
                  text-xs ${currentTheme.colors.text} whitespace-nowrap opacity-0
                  group-hover:opacity-100 transition-opacity duration-200 pointer-events-none
                  shadow-lg z-10
                `}>
                  {mode.description}
                  <div className={`
                    absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 
                    border-l-4 border-r-4 border-t-4 border-transparent
                  `} 
                  style={{ 
                    borderTopColor: currentTheme.colors.surface.includes('bg-') 
                      ? currentTheme.colors.surface.replace('bg-', '#') 
                      : '#ffffff' 
                  }} />
                </div>
              </button>
            ))}
          </div>

          {/* Center Section - Mode Info */}
          <div className={`text-sm ${currentTheme.colors.textMuted} hidden md:block`}>
            {currentMode === 'text' && 'Rich text editing with formatting tools'}
            {currentMode === 'markdown' && 'Write using Markdown syntax'}
            {currentMode === 'preview' && 'Live preview of rendered Markdown'}
          </div>

          {/* Right Section - Word Count */}
          <div className="relative">
            <button
              className={`
                text-sm ${currentTheme.colors.textMuted} hover:${currentTheme.colors.textSecondary}
                transition-colors duration-200 cursor-pointer
              `}
              onMouseEnter={() => setShowWordDetails(true)}
              onMouseLeave={() => setShowWordDetails(false)}
            >
              {wordCount} words
            </button>

            {/* Word Count Tooltip */}
            {showWordDetails && (
              <div className={`
                absolute bottom-full right-0 mb-2 px-3 py-2
                ${currentTheme.colors.surface} ${currentTheme.colors.border} border rounded-lg
                shadow-lg z-50 whitespace-nowrap
              `}>
                <div className={`text-sm ${currentTheme.colors.text} space-y-1`}>
                  <div>{wordCount.toLocaleString()} words</div>
                  <div>{characterCount.toLocaleString()} characters</div>
                  <div className={`text-xs ${currentTheme.colors.textMuted} pt-1 border-t ${currentTheme.colors.border}`}>
                    Mode: {currentMode.charAt(0).toUpperCase() + currentMode.slice(1)}
                  </div>
                </div>
                {/* Arrow pointing down */}
                <div className={`
                  absolute top-full right-4 w-0 h-0 
                  border-l-4 border-r-4 border-t-4 border-transparent
                `} 
                style={{ 
                  borderTopColor: currentTheme.colors.surface.includes('bg-') 
                    ? currentTheme.colors.surface.replace('bg-', '#') 
                    : '#ffffff' 
                }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}