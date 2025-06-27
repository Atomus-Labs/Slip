import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Note } from '../types';

interface MarkdownEditorProps {
  note: Note;
  onUpdateNote: (note: Note) => void;
  title: string;
  onTitleChange: (title: string) => void;
}

// Convert blocks to markdown
function blocksToMarkdown(blocks: any[]): string {
  return blocks.map(block => {
    switch (block.type) {
      case 'heading1':
        return `# ${block.content}`;
      case 'heading2':
        return `## ${block.content}`;
      case 'heading3':
        return `### ${block.content}`;
      case 'bulletList':
        return `- ${block.content}`;
      case 'numberedList':
        return `1. ${block.content}`;
      case 'blockquote':
        return `> ${block.content}`;
      case 'paragraph':
      default:
        return block.content;
    }
  }).join('\n\n');
}

// Parse markdown to blocks
function markdownToBlocks(markdown: string): any[] {
  const lines = markdown.split('\n');
  const blocks: any[] = [];
  let currentParagraph = '';

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addBlock = (type: string, content: string) => {
    if (content.trim()) {
      blocks.push({
        id: generateId(),
        type,
        content: content.trim()
      });
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Empty line - finish current paragraph
    if (line.trim() === '') {
      if (currentParagraph.trim()) {
        addBlock('paragraph', currentParagraph);
        currentParagraph = '';
      }
      continue;
    }

    // Heading 1
    if (line.startsWith('# ')) {
      if (currentParagraph.trim()) {
        addBlock('paragraph', currentParagraph);
        currentParagraph = '';
      }
      addBlock('heading1', line.substring(2));
      continue;
    }

    // Heading 2
    if (line.startsWith('## ')) {
      if (currentParagraph.trim()) {
        addBlock('paragraph', currentParagraph);
        currentParagraph = '';
      }
      addBlock('heading2', line.substring(3));
      continue;
    }

    // Heading 3
    if (line.startsWith('### ')) {
      if (currentParagraph.trim()) {
        addBlock('paragraph', currentParagraph);
        currentParagraph = '';
      }
      addBlock('heading3', line.substring(4));
      continue;
    }

    // Bullet list
    if (line.startsWith('- ') || line.startsWith('* ')) {
      if (currentParagraph.trim()) {
        addBlock('paragraph', currentParagraph);
        currentParagraph = '';
      }
      addBlock('bulletList', line.substring(2));
      continue;
    }

    // Numbered list
    if (/^\d+\.\s/.test(line)) {
      if (currentParagraph.trim()) {
        addBlock('paragraph', currentParagraph);
        currentParagraph = '';
      }
      addBlock('numberedList', line.replace(/^\d+\.\s/, ''));
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      if (currentParagraph.trim()) {
        addBlock('paragraph', currentParagraph);
        currentParagraph = '';
      }
      addBlock('blockquote', line.substring(2));
      continue;
    }

    // Regular paragraph text
    currentParagraph += (currentParagraph ? '\n' : '') + line;
  }

  // Add final paragraph
  if (currentParagraph.trim()) {
    addBlock('paragraph', currentParagraph);
  }

  return blocks.length > 0 ? blocks : [{
    id: generateId(),
    type: 'paragraph',
    content: ''
  }];
}

export function MarkdownEditor({ note, onUpdateNote, title, onTitleChange }: MarkdownEditorProps) {
  const { currentTheme } = useTheme();
  const [markdown, setMarkdown] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cursorPositionRef = useRef<number>(0);
  const isUpdatingFromNoteRef = useRef(false);

  // Convert blocks to markdown when note changes (but not when we're typing)
  useEffect(() => {
    if (!isUpdatingFromNoteRef.current) {
      const contentBlocks = note.blocks.slice(1); // Skip title block
      const markdownContent = blocksToMarkdown(contentBlocks);
      setMarkdown(markdownContent);
    }
    isUpdatingFromNoteRef.current = false;
  }, [note.blocks]);

  // FIXED: Preserve cursor position after state updates
  useEffect(() => {
    if (textareaRef.current && cursorPositionRef.current !== undefined) {
      const textarea = textareaRef.current;
      const position = cursorPositionRef.current;
      
      // Restore cursor position after React re-render
      requestAnimationFrame(() => {
        if (textarea && position <= textarea.value.length) {
          textarea.setSelectionRange(position, position);
        }
      });
    }
  }, [markdown]);

  // FIXED: Debounced update function that doesn't interfere with typing
  const debouncedUpdate = (newMarkdown: string) => {
    // Clear any existing timeout
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    // Set a new timeout to update after user stops typing
    updateTimeoutRef.current = setTimeout(() => {
      // Mark that we're updating from our own changes
      isUpdatingFromNoteRef.current = true;
      
      // Parse markdown back to blocks
      const newBlocks = markdownToBlocks(newMarkdown);
      
      // Create title block
      const titleBlock = {
        id: note.blocks[0]?.id || Math.random().toString(36).substr(2, 9),
        type: 'heading1',
        content: title
      };

      const updatedNote: Note = {
        ...note,
        blocks: [titleBlock, ...newBlocks],
        updatedAt: new Date()
      };

      onUpdateNote(updatedNote);
    }, 300); // Reduced to 300ms for faster response
  };

  // FIXED: Handle input changes with cursor position preservation
  const handleMarkdownChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMarkdown = e.target.value;
    const cursorPosition = e.target.selectionStart;
    
    // Store cursor position
    cursorPositionRef.current = cursorPosition;
    
    // Update local state immediately for responsive typing
    setMarkdown(newMarkdown);
    
    // Debounce the note update to prevent interference
    debouncedUpdate(newMarkdown);
  };

  // Handle key events to preserve cursor position
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Store cursor position on any key press
    const target = e.target as HTMLTextAreaElement;
    cursorPositionRef.current = target.selectionStart;
  };

  // Handle selection changes to track cursor position
  const handleSelectionChange = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    cursorPositionRef.current = target.selectionStart;
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [markdown]);

  // Get theme colors
  const getThemeColors = () => {
    const surfaceColor = currentTheme.colors.surface.replace('bg-', '');
    const borderColor = currentTheme.colors.border.replace('border-', '');
    const textColor = currentTheme.colors.text.replace('text-', '');
    const textMutedColor = currentTheme.colors.textMuted.replace('text-', '');
    const accentColor = currentTheme.colors.accent.replace('bg-', '');
    
    const colorMap: Record<string, string> = {
      // Studio theme colors
      '[#ece9e2]': '#ece9e2',
      '[#d8d4c1]': '#d8d4c1',
      '[#c0bebb]': '#c0bebb',
      '[#302e2f]': '#302e2f',
      '[#a19f9a]': '#a19f9a',
      '[#b25e43]': '#b25e43',
      '[#242424]': '#242424',
      '[#1a1a1a]': '#1a1a1a',
      '[#6b6b69]': '#6b6b69',
      '[#c5bebb]': '#c5bebb',
      '[#a66044]': '#a66044',
      
      // Platinum theme colors
      '[#fbfbfb]': '#fbfbfb',
      '[#fafafa]': '#fafafa',
      '[#dcdbdc]': '#dcdbdc',
      '[#2f2f2f]': '#2f2f2f',
      '[#7b7b7b]': '#7b7b7b',
      '[#515559]': '#515559',
      '[#040404]': '#040404',
      '[#2d2d2d]': '#2d2d2d',
      '[#555554]': '#555554',
      '[#e7e7e7]': '#e7e7e7',
      '[#c2c4c6]': '#c2c4c6',
      
      // Carbon theme colors
      '[#f9f9f9]': '#f9f9f9',
      '[#f7f7f8]': '#f7f7f8',
      '[#d0d0d0]': '#d0d0d0',
      '[#2d2d2d]': '#2d2d2d',
      '[#a1a1a1]': '#a1a1a1',
      '[#7178cb]': '#7178cb',
      '[#0d0d0d]': '#0d0d0d',
      '[#121313]': '#121313',
      '[#3b3b3c]': '#3b3b3c',
      '[#e8e8e9]': '#e8e8e9',
      '[#5d68be]': '#5d68be',
      
      // Arctic theme colors
      'white': '#ffffff',
      'gray-50': '#f9fafb',
      'gray-200': '#e5e7eb',
      'gray-900': '#111827',
      'gray-500': '#6b7280',
      'blue-600': '#2563eb',
      'gray-800': '#1f2937',
      'gray-700': '#374151',
      'gray-100': '#f3f4f6',
      'gray-300': '#d1d5db',
      'blue-500': '#3b82f6'
    };

    const resolveColor = (colorClass: string): string => {
      return colorMap[colorClass] || colorClass;
    };

    return {
      surface: resolveColor(surfaceColor),
      border: resolveColor(borderColor),
      text: resolveColor(textColor),
      textMuted: resolveColor(textMutedColor),
      accent: resolveColor(accentColor),
      borderHover: currentTheme.mode === 'light' ? '#9ca3af' : '#6b7280',
      borderFocus: resolveColor(accentColor)
    };
  };

  const themeColors = getThemeColors();

  return (
    <div className="markdown-editor-container">
      {/* Title Input */}
      <div className="mb-8">
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Untitled"
          className="title-input"
          dir="ltr"
        />
      </div>

      {/* Markdown Editor */}
      <div className="editor-container">
        <textarea
          ref={textareaRef}
          value={markdown}
          onChange={handleMarkdownChange}
          onKeyDown={handleKeyDown}
          onSelect={handleSelectionChange}
          onMouseUp={handleSelectionChange}
          placeholder="Start writing in Markdown...

# Heading 1
## Heading 2
### Heading 3

**Bold text** and *italic text*

- Bullet point
- Another point

1. Numbered list
2. Second item

> Blockquote

`inline code`"
          className="markdown-textarea"
          dir="ltr"
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          data-gramm="false"
          data-gramm_editor="false"
          data-enable-grammarly="false"
        />
      </div>

      <style jsx>{`
        .title-input {
          width: 100%;
          font-size: 2.5rem;
          font-weight: 700;
          line-height: 1.1;
          padding: 1.5rem 2rem;
          border: 5px solid ${themeColors.border};
          border-radius: 1.5rem;
          background: ${themeColors.surface};
          color: ${themeColors.text};
          outline: none;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          direction: ltr;
          text-align: left;
        }
        
        .title-input:hover {
          border-color: ${themeColors.borderHover};
          border-width: 5px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
          transform: translateY(-1px);
        }
        
        .title-input:focus {
          border-color: ${themeColors.borderFocus};
          border-width: 5px;
          box-shadow: 0 0 0 4px ${themeColors.borderFocus}25, 0 8px 25px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }
        
        .title-input::placeholder {
          color: ${themeColors.textMuted};
          font-style: italic;
          font-weight: 400;
        }
        
        .editor-container {
          border: 5px solid ${themeColors.border};
          border-radius: 1.5rem;
          background: ${themeColors.surface};
          padding: 2.5rem;
          min-height: 700px;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          direction: ltr;
        }
        
        .editor-container:hover {
          border-color: ${themeColors.borderHover};
          border-width: 5px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
        }
        
        .editor-container:focus-within {
          border-color: ${themeColors.borderFocus};
          border-width: 5px;
          box-shadow: 0 0 0 4px ${themeColors.borderFocus}25, 0 8px 25px rgba(0, 0, 0, 0.15);
        }
        
        .markdown-textarea {
          width: 100%;
          min-height: 650px;
          padding: 0;
          margin: 0;
          border: none;
          background: transparent;
          color: ${themeColors.text};
          outline: none;
          resize: none;
          white-space: pre-wrap;
          word-wrap: break-word;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 16px;
          line-height: 1.7;
          direction: ltr;
          text-align: left;
        }
        
        .markdown-textarea::placeholder {
          color: ${themeColors.textMuted};
          font-style: italic;
        }
      `}</style>
    </div>
  );
}