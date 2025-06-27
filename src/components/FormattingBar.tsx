import React from 'react';
import { 
  Type, 
  Hash, 
  List, 
  ListOrdered, 
  Bold, 
  Italic, 
  Code,
  Quote,
  Minus
} from 'lucide-react';
import { Editor } from '@tiptap/react';
import { useTheme } from '../contexts/ThemeContext';

interface FormattingBarProps {
  editor: Editor | null;
}

export function FormattingBar({ editor }: FormattingBarProps) {
  const { currentTheme } = useTheme();

  if (!editor) return null;

  // Format tools for quick access
  const formatTools = [
    {
      icon: Bold,
      label: 'Bold',
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
      shortcut: '⌘B'
    },
    {
      icon: Italic,
      label: 'Italic', 
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
      shortcut: '⌘I'
    },
    {
      icon: Code,
      label: 'Code',
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: editor.isActive('code'),
      shortcut: '⌘E'
    }
  ];

  // Block type tools
  const blockTools = [
    {
      icon: Type,
      label: 'Paragraph',
      action: () => editor.chain().focus().setParagraph().run(),
      isActive: editor.isActive('paragraph')
    },
    {
      icon: Hash,
      label: 'Heading 1',
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive('heading', { level: 1 })
    },
    {
      icon: Hash,
      label: 'Heading 2',
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive('heading', { level: 2 }),
      size: 'sm'
    },
    {
      icon: Hash,
      label: 'Heading 3',
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor.isActive('heading', { level: 3 }),
      size: 'xs'
    },
    {
      icon: List,
      label: 'Bullet List',
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList')
    },
    {
      icon: ListOrdered,
      label: 'Numbered List',
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList')
    },
    {
      icon: Quote,
      label: 'Quote',
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive('blockquote')
    },
    {
      icon: Minus,
      label: 'Divider',
      action: () => editor.chain().focus().setHorizontalRule().run(),
      isActive: false
    }
  ];

  return (
    <div className={`
      ${currentTheme.colors.surface} ${currentTheme.colors.border} border
      rounded-xl p-4 mb-6 shadow-sm
    `}>
      <div className="flex items-center justify-between">
        
        {/* Left Section - Text Formatting */}
        <div className="flex items-center space-x-1">
          <span className={`text-sm font-medium ${currentTheme.colors.textSecondary} mr-3`}>
            Format:
          </span>
          
          {formatTools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <button
                key={index}
                onClick={tool.action}
                className={`
                  p-2.5 rounded-lg transition-all duration-200 group relative
                  ${tool.isActive 
                    ? `${currentTheme.colors.accent} ${currentTheme.colors.accentText} shadow-md` 
                    : `${currentTheme.colors.textMuted} ${currentTheme.colors.surfaceHover} hover:${currentTheme.colors.textSecondary}`
                  }
                `}
                title={`${tool.label} (${tool.shortcut})`}
              >
                <Icon size={18} />
                
                {/* Tooltip */}
                <div className={`
                  absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1
                  ${currentTheme.colors.surface} ${currentTheme.colors.border} border rounded-md
                  text-xs ${currentTheme.colors.text} whitespace-nowrap opacity-0
                  group-hover:opacity-100 transition-opacity duration-200 pointer-events-none
                  shadow-lg z-10
                `}>
                  {tool.label}
                  <div className="text-xs opacity-60 mt-0.5">{tool.shortcut}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className={`w-px h-8 ${currentTheme.colors.border.replace('border-', 'bg-')} mx-4`} />

        {/* Right Section - Block Types */}
        <div className="flex items-center space-x-1">
          <span className={`text-sm font-medium ${currentTheme.colors.textSecondary} mr-3`}>
            Blocks:
          </span>
          
          {blockTools.map((tool, index) => {
            const Icon = tool.icon;
            const iconSize = tool.size === 'xs' ? 14 : tool.size === 'sm' ? 16 : 18;
            
            return (
              <button
                key={index}
                onClick={tool.action}
                className={`
                  p-2.5 rounded-lg transition-all duration-200 group relative
                  ${tool.isActive 
                    ? `${currentTheme.colors.accent} ${currentTheme.colors.accentText} shadow-md` 
                    : `${currentTheme.colors.textMuted} ${currentTheme.colors.surfaceHover} hover:${currentTheme.colors.textSecondary}`
                  }
                `}
                title={tool.label}
              >
                <Icon size={iconSize} />
                
                {/* Tooltip */}
                <div className={`
                  absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1
                  ${currentTheme.colors.surface} ${currentTheme.colors.border} border rounded-md
                  text-xs ${currentTheme.colors.text} whitespace-nowrap opacity-0
                  group-hover:opacity-100 transition-opacity duration-200 pointer-events-none
                  shadow-lg z-10
                `}>
                  {tool.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}