import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import Paragraph from '@tiptap/extension-paragraph';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Document from '@tiptap/extension-document';
import Text from '@tiptap/extension-text';
import Placeholder from '@tiptap/extension-placeholder';
import Blockquote from '@tiptap/extension-blockquote';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Code from '@tiptap/extension-code';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import { Note, Block } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { EditorFooter } from './EditorFooter';
import { FormattingBar } from './FormattingBar';
import { MarkdownEditor } from './MarkdownEditor';
import { MarkdownPreview } from './MarkdownPreview';

interface TipTapEditorProps {
  note: Note;
  onUpdateNote: (note: Note) => void;
}

type EditorMode = 'text' | 'markdown' | 'preview';

// Convert our block structure to TipTap JSON format (excluding the first heading)
function blocksToTipTapJSON(blocks: Block[]) {
  // Skip the first block if it's a heading (we'll handle that separately as title)
  const contentBlocks = blocks.slice(1);
  
  const content = contentBlocks.map(block => {
    switch (block.type) {
      case 'heading1':
        return {
          type: 'heading',
          attrs: { level: 1 },
          content: block.content ? [{ type: 'text', text: block.content }] : []
        };
      case 'heading2':
        return {
          type: 'heading',
          attrs: { level: 2 },
          content: block.content ? [{ type: 'text', text: block.content }] : []
        };
      case 'heading3':
        return {
          type: 'heading',
          attrs: { level: 3 },
          content: block.content ? [{ type: 'text', text: block.content }] : []
        };
      case 'bulletList':
        return {
          type: 'bulletList',
          content: [{
            type: 'listItem',
            content: [{
              type: 'paragraph',
              content: block.content ? [{ type: 'text', text: block.content }] : []
            }]
          }]
        };
      case 'numberedList':
        return {
          type: 'orderedList',
          content: [{
            type: 'listItem',
            content: [{
              type: 'paragraph',
              content: block.content ? [{ type: 'text', text: block.content }] : []
            }]
          }]
        };
      case 'blockquote':
        return {
          type: 'blockquote',
          content: [{
            type: 'paragraph',
            content: block.content ? [{ type: 'text', text: block.content }] : []
          }]
        };
      case 'paragraph':
      default:
        return {
          type: 'paragraph',
          content: block.content ? [{ type: 'text', text: block.content }] : []
        };
    }
  });

  return {
    type: 'doc',
    content: content.length > 0 ? content : [{
      type: 'paragraph',
      content: []
    }]
  };
}

// Convert TipTap JSON back to our block structure (excluding title)
function tipTapJSONToBlocks(json: any, titleBlock: Block): Block[] {
  const blocks: Block[] = [titleBlock]; // Always start with the title block

  if (!json || !json.content) {
    // Add an empty paragraph if no content
    blocks.push({
      id: generateId(),
      type: 'paragraph',
      content: ''
    });
    return blocks;
  }

  const processContent = (content: any[]) => {
    content.forEach(node => {
      switch (node.type) {
        case 'heading':
          const level = node.attrs?.level || 1;
          const headingType = level === 1 ? 'heading1' : level === 2 ? 'heading2' : 'heading3';
          blocks.push({
            id: generateId(),
            type: headingType,
            content: extractTextFromNode(node)
          });
          break;
        
        case 'paragraph':
          blocks.push({
            id: generateId(),
            type: 'paragraph',
            content: extractTextFromNode(node)
          });
          break;
        
        case 'bulletList':
          if (node.content) {
            node.content.forEach((listItem: any) => {
              blocks.push({
                id: generateId(),
                type: 'bulletList',
                content: extractTextFromNode(listItem)
              });
            });
          }
          break;
        
        case 'orderedList':
          if (node.content) {
            node.content.forEach((listItem: any) => {
              blocks.push({
                id: generateId(),
                type: 'numberedList',
                content: extractTextFromNode(listItem)
              });
            });
          }
          break;
        
        case 'blockquote':
          blocks.push({
            id: generateId(),
            type: 'blockquote',
            content: extractTextFromNode(node)
          });
          break;
        
        default:
          blocks.push({
            id: generateId(),
            type: 'paragraph',
            content: extractTextFromNode(node)
          });
      }
    });
  };

  processContent(json.content);

  return blocks;
}

// Extract text content from a TipTap node
function extractTextFromNode(node: any): string {
  if (!node) return '';
  
  if (node.type === 'text') {
    return node.text || '';
  }
  
  if (node.content && Array.isArray(node.content)) {
    return node.content.map(extractTextFromNode).join('');
  }
  
  return '';
}

// Generate a simple ID
function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Count words in text
function countWords(text: string): number {
  return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
}

// Count characters in text
function countCharacters(text: string): number {
  return text.length;
}

export function TipTapEditor({ note, onUpdateNote }: TipTapEditorProps) {
  const { currentTheme } = useTheme();
  const [title, setTitle] = useState(note.title);
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [currentMode, setCurrentMode] = useState<EditorMode>('text');

  // Get theme-aware colors for borders and backgrounds
  const getThemeColors = () => {
    // Extract the actual color values from theme classes
    const surfaceColor = currentTheme.colors.surface.replace('bg-', '');
    const borderColor = currentTheme.colors.border.replace('border-', '');
    const textColor = currentTheme.colors.text.replace('text-', '');
    const textMutedColor = currentTheme.colors.textMuted.replace('text-', '');
    const accentColor = currentTheme.colors.accent.replace('bg-', '');
    
    // Convert theme class names to actual hex/color values
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
      
      // Arctic theme colors (standard Tailwind)
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
      // Generate hover and focus colors
      borderHover: currentTheme.mode === 'light' ? '#9ca3af' : '#6b7280',
      borderFocus: resolveColor(accentColor)
    };
  };

  const themeColors = getThemeColors();

  // SPECIAL HANDLING FOR PLATINUM DARK - BLACK TITLE TEXT
  const getTitleTextColor = () => {
    if (currentTheme.id === 'platinum-dark') {
      return '#000000'; // BLACK text for Platinum Dark title
    }
    return themeColors.text; // Default theme text color for all others
  };

  const getTitlePlaceholderColor = () => {
    if (currentTheme.id === 'platinum-dark') {
      return '#666666'; // Dark gray placeholder for Platinum Dark
    }
    return themeColors.textMuted; // Default muted color for all others
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Blockquote,
      HorizontalRule,
      Code,
      Bold,
      Italic,
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            const level = node.attrs.level;
            return `Heading ${level}`;
          }
          return "Start writing your content...";
        },
      }),
    ],
    content: blocksToTipTapJSON(note.blocks),
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      
      // Update word and character counts
      const editorText = editor.getText();
      const titleText = title;
      const totalText = titleText + ' ' + editorText;
      
      setWordCount(countWords(totalText));
      setCharacterCount(countCharacters(totalText));
      
      // Create title block
      const titleBlock: Block = {
        id: note.blocks[0]?.id || generateId(),
        type: 'heading1',
        content: title
      };
      
      const newBlocks = tipTapJSONToBlocks(json, titleBlock);
      
      const updatedNote: Note = {
        ...note,
        title: title,
        blocks: newBlocks,
        updatedAt: new Date()
      };
      
      onUpdateNote(updatedNote);
    },
    editorProps: {
      attributes: {
        class: `tiptap-editor prose prose-lg max-w-none focus:outline-none`,
        dir: 'ltr',
      },
    },
  });

  // Handle title changes
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    
    // Update word and character counts
    const editorText = editor?.getText() || '';
    const totalText = newTitle + ' ' + editorText;
    setWordCount(countWords(totalText));
    setCharacterCount(countCharacters(totalText));
    
    // Update the note immediately
    const titleBlock: Block = {
      id: note.blocks[0]?.id || generateId(),
      type: 'heading1',
      content: newTitle
    };
    
    const updatedBlocks = [titleBlock, ...note.blocks.slice(1)];
    
    const updatedNote: Note = {
      ...note,
      title: newTitle,
      blocks: updatedBlocks,
      updatedAt: new Date()
    };
    
    onUpdateNote(updatedNote);
  };

  // Update title when note changes
  useEffect(() => {
    if (note.title !== title) {
      setTitle(note.title);
    }
  }, [note.title]);

  // Update editor content when note changes (but avoid infinite loops)
  useEffect(() => {
    if (editor && !editor.isFocused && currentMode === 'text') {
      const currentJSON = editor.getJSON();
      const newJSON = blocksToTipTapJSON(note.blocks);
      
      // Only update if content actually changed
      if (JSON.stringify(currentJSON) !== JSON.stringify(newJSON)) {
        editor.commands.setContent(newJSON);
      }
    }
  }, [note.blocks, editor, currentMode]);

  // Initial word count calculation
  useEffect(() => {
    if (editor) {
      const editorText = editor.getText();
      const totalText = title + ' ' + editorText;
      setWordCount(countWords(totalText));
      setCharacterCount(countCharacters(totalText));
    }
  }, [editor, title]);

  // Update word count when switching modes
  useEffect(() => {
    const contentBlocks = note.blocks.slice(1);
    const allText = title + ' ' + contentBlocks.map(block => block.content).join(' ');
    setWordCount(countWords(allText));
    setCharacterCount(countCharacters(allText));
  }, [currentMode, note.blocks, title]);

  if (!editor && currentMode === 'text') {
    return (
      <div className={`flex-1 max-w-7xl mx-auto p-8 ${currentTheme.colors.background}`}>
        <div className={`text-center ${currentTheme.colors.textMuted}`}>
          Loading editor...
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`flex-1 max-w-7xl mx-auto p-8 ${currentTheme.colors.background} pb-32`}>
        
        {/* Text Mode - Rich Text Editor */}
        {currentMode === 'text' && (
          <>
            {/* Separate Title Input with Theme-Aware Styling */}
            <div className="mb-8">
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Untitled"
                className="title-input"
                dir="ltr"
              />
            </div>

            {/* Formatting Bar - Between Title and Editor */}
            <FormattingBar editor={editor} />

            {/* Text Editor with Theme-Aware Styling */}
            <div className="editor-container" dir="ltr">
              <EditorContent 
                editor={editor} 
                className="tiptap-content"
              />
            </div>
          </>
        )}

        {/* Markdown Mode - Markdown Editor */}
        {currentMode === 'markdown' && (
          <MarkdownEditor
            note={note}
            onUpdateNote={onUpdateNote}
            title={title}
            onTitleChange={handleTitleChange}
          />
        )}

        {/* Preview Mode - Rendered Markdown */}
        {currentMode === 'preview' && (
          <MarkdownPreview
            note={note}
            title={title}
          />
        )}
        
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
            color: ${getTitleTextColor()}; /* SPECIAL HANDLING FOR PLATINUM DARK */
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
            color: ${getTitlePlaceholderColor()}; /* SPECIAL HANDLING FOR PLATINUM DARK */
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
          
          .tiptap-content {
            outline: none;
            direction: ltr;
            min-height: 650px;
          }
          
          .tiptap-editor {
            outline: none;
            min-height: 650px;
            direction: ltr;
            text-align: left;
            line-height: 1.7;
            font-size: 16px;
            color: ${themeColors.text};
            background: transparent;
          }
          
          .tiptap-editor h1 {
            font-size: 2rem;
            font-weight: 600;
            line-height: 1.2;
            margin-bottom: 1rem;
            margin-top: 2rem;
            direction: ltr;
            text-align: left;
            color: ${themeColors.text};
          }
          
          .tiptap-editor h2 {
            font-size: 1.75rem;
            font-weight: 600;
            line-height: 1.2;
            margin-bottom: 1rem;
            margin-top: 2rem;
            direction: ltr;
            text-align: left;
            color: ${themeColors.text};
          }
          
          .tiptap-editor h3 {
            font-size: 1.5rem;
            font-weight: 500;
            line-height: 1.3;
            margin-bottom: 0.75rem;
            margin-top: 1.5rem;
            direction: ltr;
            text-align: left;
            color: ${themeColors.text};
          }
          
          .tiptap-editor p {
            line-height: 1.7;
            margin-bottom: 1rem;
            margin-top: 0;
            direction: ltr;
            text-align: left;
            color: ${currentTheme.colors.textSecondary.replace('text-', '').includes('[') 
              ? themeColors.text 
              : currentTheme.colors.textSecondary.replace('text-', '')};
          }
          
          .tiptap-editor blockquote {
            border-left: 4px solid ${themeColors.accent};
            padding-left: 1rem;
            margin: 1.5rem 0;
            font-style: italic;
            color: ${themeColors.textMuted};
          }
          
          .tiptap-editor code {
            background: ${currentTheme.mode === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'};
            padding: 0.25rem 0.5rem;
            border-radius: 0.375rem;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 0.875rem;
            color: ${currentTheme.mode === 'light' ? '#d63384' : '#ff6b9d'};
          }
          
          .tiptap-editor .tiptap-bullet-list,
          .tiptap-editor .tiptap-ordered-list {
            padding-left: 1.5rem;
            margin-bottom: 1rem;
            margin-top: 0;
            direction: ltr;
          }
          
          .tiptap-editor .tiptap-bullet-list li,
          .tiptap-editor .tiptap-ordered-list li {
            line-height: 1.7;
            margin-bottom: 0.5rem;
            direction: ltr;
            text-align: left;
            color: ${currentTheme.colors.textSecondary.replace('text-', '').includes('[') 
              ? themeColors.text 
              : currentTheme.colors.textSecondary.replace('text-', '')};
          }
          
          .tiptap-editor .tiptap-bullet-list li p,
          .tiptap-editor .tiptap-ordered-list li p {
            margin-bottom: 0;
          }
          
          .tiptap-editor .ProseMirror-focused {
            outline: none;
          }
          
          .tiptap-editor .is-editor-empty:first-child::before {
            content: attr(data-placeholder);
            float: left;
            pointer-events: none;
            height: 0;
            direction: ltr;
            font-style: italic;
            color: ${themeColors.textMuted};
          }
          
          .tiptap-editor .ProseMirror {
            outline: none;
            direction: ltr;
            text-align: left;
          }
          
          .tiptap-editor ul,
          .tiptap-editor ol {
            text-align: left;
            padding-left: 1.5rem;
            padding-right: 0;
          }
          
          .tiptap-editor ul {
            list-style-type: disc;
          }
          
          .tiptap-editor ol {
            list-style-type: decimal;
          }
          
          .tiptap-editor li {
            padding-left: 0.25rem;
          }
          
          /* Better spacing for empty paragraphs */
          .tiptap-editor p:empty {
            min-height: 1.5rem;
          }
          
          /* CRITICAL FIX: Force placeholder text to be visible in all themes */
          .tiptap-editor .ProseMirror p.is-editor-empty:first-child::before {
            color: ${themeColors.textMuted} !important;
            content: attr(data-placeholder);
            float: left;
            pointer-events: none;
            height: 0;
            direction: ltr;
            font-style: italic;
            opacity: 1 !important;
            display: block !important;
            visibility: visible !important;
          }
          
          /* Additional placeholder styling for different elements */
          .tiptap-editor .ProseMirror .is-empty::before {
            color: ${themeColors.textMuted} !important;
            content: attr(data-placeholder);
            float: left;
            pointer-events: none;
            height: 0;
            direction: ltr;
            font-style: italic;
            opacity: 1 !important;
            display: block !important;
            visibility: visible !important;
          }
          
          /* Ensure placeholder text is visible in both light and dark modes */
          .tiptap-editor .ProseMirror [data-placeholder]::before {
            color: ${themeColors.textMuted} !important;
            opacity: 1 !important;
            display: block !important;
            visibility: visible !important;
          }
          
          /* Force TipTap placeholder to show */
          .tiptap-editor .ProseMirror .is-editor-empty::before {
            color: ${themeColors.textMuted} !important;
            content: "Start writing your content...";
            float: left !important;
            pointer-events: none !important;
            height: 0 !important;
            direction: ltr !important;
            font-style: italic !important;
            opacity: 1 !important;
            display: block !important;
            visibility: visible !important;
          }
          
          /* Specific fix for all dark modes */
          .theme-studio-dark .tiptap-editor .ProseMirror .is-editor-empty::before,
          .theme-platinum-dark .tiptap-editor .ProseMirror .is-editor-empty::before,
          .theme-carbon-dark .tiptap-editor .ProseMirror .is-editor-empty::before,
          .theme-arctic-dark .tiptap-editor .ProseMirror .is-editor-empty::before {
            color: ${currentTheme.mode === 'dark' ? themeColors.textMuted : themeColors.textMuted} !important;
            opacity: 1 !important;
            display: block !important;
            visibility: visible !important;
          }
        `}</style>
      </div>

      {/* Editor Footer */}
      <EditorFooter
        editor={editor}
        note={note}
        wordCount={wordCount}
        characterCount={characterCount}
        currentMode={currentMode}
        onModeChange={setCurrentMode}
      />
    </>
  );
}