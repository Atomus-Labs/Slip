import React from 'react';
import { Note } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface NoteThumbnailProps {
  note: Note;
}

export function NoteThumbnail({ note }: NoteThumbnailProps) {
  const { currentTheme } = useTheme();
  
  // Get first 4-5 blocks for thumbnail
  const previewBlocks = note.blocks.slice(0, 5);

  const getBlockStyles = (blockType: string, content: string) => {
    const hasContent = content.trim().length > 0;
    
    switch (blockType) {
      case 'heading1':
        return {
          fontSize: '10px',
          fontWeight: '700',
          lineHeight: '12px',
          marginBottom: '4px',
          color: hasContent ? 'currentColor' : 'transparent',
          backgroundColor: hasContent ? 'transparent' : 'currentColor',
          height: hasContent ? 'auto' : '8px',
          borderRadius: hasContent ? '0' : '2px',
          width: hasContent ? '100%' : '75%'
        };
      case 'heading2':
        return {
          fontSize: '8px',
          fontWeight: '600',
          lineHeight: '10px',
          marginBottom: '3px',
          color: hasContent ? 'currentColor' : 'transparent',
          backgroundColor: hasContent ? 'transparent' : 'currentColor',
          height: hasContent ? 'auto' : '6px',
          borderRadius: hasContent ? '0' : '2px',
          width: hasContent ? '100%' : '65%'
        };
      case 'heading3':
        return {
          fontSize: '7px',
          fontWeight: '500',
          lineHeight: '9px',
          marginBottom: '3px',
          color: hasContent ? 'currentColor' : 'transparent',
          backgroundColor: hasContent ? 'transparent' : 'currentColor',
          height: hasContent ? 'auto' : '5px',
          borderRadius: hasContent ? '0' : '2px',
          width: hasContent ? '100%' : '55%'
        };
      case 'bulletList':
        return {
          fontSize: '6px',
          lineHeight: '8px',
          marginBottom: '2px',
          paddingLeft: '8px',
          position: 'relative' as const,
          color: hasContent ? 'currentColor' : 'transparent',
          backgroundColor: hasContent ? 'transparent' : 'currentColor',
          height: hasContent ? 'auto' : '4px',
          borderRadius: hasContent ? '0' : '2px',
          width: hasContent ? '100%' : '60%'
        };
      case 'numberedList':
        return {
          fontSize: '6px',
          lineHeight: '8px',
          marginBottom: '2px',
          paddingLeft: '10px',
          position: 'relative' as const,
          color: hasContent ? 'currentColor' : 'transparent',
          backgroundColor: hasContent ? 'transparent' : 'currentColor',
          height: hasContent ? 'auto' : '4px',
          borderRadius: hasContent ? '0' : '2px',
          width: hasContent ? '100%' : '60%'
        };
      default: // paragraph
        return {
          fontSize: '6px',
          lineHeight: '8px',
          marginBottom: '2px',
          color: hasContent ? 'currentColor' : 'transparent',
          backgroundColor: hasContent ? 'transparent' : 'currentColor',
          height: hasContent ? 'auto' : '4px',
          borderRadius: hasContent ? '0' : '2px',
          width: hasContent ? '100%' : '70%'
        };
    }
  };

  const renderBlockContent = (block: any, index: number) => {
    const styles = getBlockStyles(block.type, block.content);
    const hasContent = block.content.trim().length > 0;
    
    // Truncate content for display
    const displayContent = hasContent 
      ? block.content.length > 50 
        ? block.content.substring(0, 50) + '...'
        : block.content
      : '';

    if (block.type === 'bulletList') {
      return (
        <div key={block.id} style={styles} className="relative">
          {hasContent && (
            <div 
              className="absolute left-0 top-1 w-1 h-1 rounded-full"
              style={{ 
                backgroundColor: 'currentColor',
                opacity: 0.7
              }}
            />
          )}
          {hasContent ? displayContent : <div style={{ width: styles.width, height: styles.height, backgroundColor: styles.backgroundColor, borderRadius: styles.borderRadius }} />}
        </div>
      );
    }
    
    if (block.type === 'numberedList') {
      return (
        <div key={block.id} style={styles} className="relative">
          {hasContent && (
            <div 
              className="absolute left-0 top-0 text-xs"
              style={{ 
                fontSize: '5px',
                opacity: 0.7
              }}
            >
              {index + 1}.
            </div>
          )}
          {hasContent ? displayContent : <div style={{ width: styles.width, height: styles.height, backgroundColor: styles.backgroundColor, borderRadius: styles.borderRadius }} />}
        </div>
      );
    }

    return (
      <div key={block.id} style={styles}>
        {hasContent ? displayContent : <div style={{ width: styles.width, height: styles.height, backgroundColor: styles.backgroundColor, borderRadius: styles.borderRadius }} />}
      </div>
    );
  };

  return (
    <div className={`w-full h-24 ${currentTheme.colors.surface} rounded-lg p-3 overflow-hidden relative ${currentTheme.colors.border} border`}>
      <div 
        className={`space-y-1 ${currentTheme.colors.textMuted} opacity-80`}
        style={{ 
          fontSize: '6px',
          lineHeight: '8px'
        }}
      >
        {previewBlocks.map((block, index) => renderBlockContent(block, index))}
        
        {/* Show more indicator if there are more blocks */}
        {note.blocks.length > 5 && (
          <div className="flex items-center space-x-1 mt-2">
            <div className={`w-1 h-1 ${currentTheme.colors.textMuted.replace('text-', 'bg-')} rounded-full opacity-60`} />
            <div className={`w-1 h-1 ${currentTheme.colors.textMuted.replace('text-', 'bg-')} rounded-full opacity-60`} />
            <div className={`w-1 h-1 ${currentTheme.colors.textMuted.replace('text-', 'bg-')} rounded-full opacity-60`} />
          </div>
        )}
      </div>
      
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black opacity-5 rounded-lg pointer-events-none" />
      
      {/* Content fade at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-current to-transparent opacity-10 rounded-b-lg pointer-events-none" 
           style={{ color: currentTheme.colors.surface.replace('bg-', '') }} />
    </div>
  );
}