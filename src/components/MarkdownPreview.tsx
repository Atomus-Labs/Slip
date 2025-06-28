import React, { useMemo } from 'react';
import { marked } from 'marked';
import { useTheme } from '../contexts/ThemeContext';
import { Note } from '../types';

interface MarkdownPreviewProps {
  note: Note;
  title: string;
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

export function MarkdownPreview({ note, title }: MarkdownPreviewProps) {
  const { currentTheme } = useTheme();

  // Configure marked options
  const markedOptions = {
    breaks: true,
    gfm: true,
  };

  // Convert note to markdown and then to HTML
  const htmlContent = useMemo(() => {
    const contentBlocks = note.blocks.slice(1); // Skip title block
    const markdown = blocksToMarkdown(contentBlocks);
    const fullMarkdown = `# ${title}\n\n${markdown}`;
    
    try {
      return marked(fullMarkdown, markedOptions);
    } catch (error) {
      console.error('Error parsing markdown:', error);
      return '<p>Error rendering markdown preview</p>';
    }
  }, [note.blocks, title]);

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
    <div className="markdown-preview-container">
      <div className="preview-container">
        <div 
          className="markdown-preview-content"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>

      <style jsx>{`
        .preview-container {
          border: 5px solid ${themeColors.border};
          border-radius: 1.5rem;
          background: ${themeColors.surface};
          padding: 4rem 3rem;
          min-height: 700px;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          direction: ltr;
          max-width: 900px;
          margin: 0 auto;
        }
        
        .preview-container:hover {
          border-color: ${themeColors.borderHover};
          border-width: 5px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
        }
        
        .markdown-preview-content {
          min-height: 650px;
          direction: ltr;
          text-align: center;
          line-height: 1.6;
          color: ${themeColors.text};
          background: transparent;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
          font-weight: 400;
          max-width: 700px;
          margin: 0 auto;
        }
        
        /* MAIN TITLE - Exactly like "Welcome to Slip" in screenshot */
        .markdown-preview-content :global(h1) {
          font-size: 3.5rem;
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 2rem;
          margin-top: 0;
          color: ${themeColors.text};
          text-align: center;
          letter-spacing: -0.02em;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        
        /* SECTION HEADINGS - Like "Features", "Getting Started", "Task List Example" */
        .markdown-preview-content :global(h2) {
          font-size: 2rem;
          font-weight: 600;
          line-height: 1.2;
          margin-bottom: 2rem;
          margin-top: 3rem;
          color: ${themeColors.text};
          text-align: center;
          letter-spacing: -0.01em;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        
        /* SUBSECTION HEADINGS */
        .markdown-preview-content :global(h3) {
          font-size: 1.5rem;
          font-weight: 600;
          line-height: 1.3;
          margin-bottom: 1.5rem;
          margin-top: 2.5rem;
          color: ${themeColors.text};
          text-align: center;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        
        .markdown-preview-content :global(h4) {
          font-size: 1.25rem;
          font-weight: 600;
          line-height: 1.4;
          margin-bottom: 1rem;
          margin-top: 2rem;
          color: ${themeColors.text};
          text-align: center;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        
        .markdown-preview-content :global(h5) {
          font-size: 1.125rem;
          font-weight: 600;
          line-height: 1.4;
          margin-bottom: 0.75rem;
          margin-top: 1.5rem;
          color: ${themeColors.text};
          text-align: center;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        
        .markdown-preview-content :global(h6) {
          font-size: 1rem;
          font-weight: 600;
          line-height: 1.4;
          margin-bottom: 0.5rem;
          margin-top: 1.25rem;
          color: ${themeColors.text};
          text-align: center;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        
        /* PARAGRAPHS - Clean, readable, centered exactly like screenshot */
        .markdown-preview-content :global(p) {
          line-height: 1.6;
          margin-bottom: 1.5rem;
          margin-top: 0;
          color: ${themeColors.text};
          font-size: 16px;
          text-align: center;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          font-weight: 400;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        
        /* LISTS - Exactly like the bullet points and numbered lists in screenshot */
        .markdown-preview-content :global(ul),
        .markdown-preview-content :global(ol) {
          text-align: left;
          max-width: 550px;
          margin: 2rem auto;
          padding-left: 0;
          list-style-position: outside;
          padding-left: 1.5rem;
        }
        
        .markdown-preview-content :global(li) {
          line-height: 1.6;
          margin-bottom: 0.75rem;
          color: ${themeColors.text};
          font-size: 16px;
          font-weight: 400;
          padding-left: 0.5rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        
        .markdown-preview-content :global(li):last-child {
          margin-bottom: 0;
        }
        
        /* Bullet points - simple dots like in screenshot */
        .markdown-preview-content :global(ul) {
          list-style-type: disc;
        }
        
        .markdown-preview-content :global(ul li)::marker {
          color: ${themeColors.text};
          font-size: 1em;
        }
        
        /* Numbered lists - clean numbers like in screenshot */
        .markdown-preview-content :global(ol) {
          list-style-type: decimal;
        }
        
        .markdown-preview-content :global(ol li)::marker {
          color: ${themeColors.text};
          font-weight: 500;
        }
        
        /* STRONG TEXT - Bold formatting like "Rich Text Editing:", "Task Lists:", etc. */
        .markdown-preview-content :global(strong) {
          font-weight: 600;
          color: ${themeColors.text};
        }
        
        /* EMPHASIS - Italic text */
        .markdown-preview-content :global(em) {
          font-style: italic;
          color: ${themeColors.text};
        }
        
        /* BLOCKQUOTES - Simple and clean */
        .markdown-preview-content :global(blockquote) {
          border-left: 4px solid ${themeColors.accent};
          padding: 1.5rem 2rem;
          margin: 2rem auto;
          font-style: italic;
          color: ${themeColors.textMuted};
          background: ${currentTheme.mode === 'light' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)'};
          border-radius: 0 0.5rem 0.5rem 0;
          max-width: 550px;
          text-align: left;
        }
        
        .markdown-preview-content :global(blockquote p) {
          margin-bottom: 0;
          color: inherit;
          text-align: left;
          font-size: 16px;
        }
        
        /* CODE - Clean inline code */
        .markdown-preview-content :global(code) {
          background: ${currentTheme.mode === 'light' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)'};
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
          font-size: 14px;
          color: ${currentTheme.mode === 'light' ? '#d63384' : '#ff6b9d'};
          font-weight: 500;
        }
        
        .markdown-preview-content :global(pre) {
          background: ${currentTheme.mode === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)'};
          padding: 1.5rem;
          border-radius: 0.75rem;
          overflow-x: auto;
          margin: 2rem auto;
          border: 1px solid ${themeColors.border};
          max-width: 600px;
          text-align: left;
        }
        
        .markdown-preview-content :global(pre code) {
          background: transparent;
          padding: 0;
          border: none;
          color: ${themeColors.text};
          font-size: 14px;
        }
        
        /* LINKS - Simple and clean */
        .markdown-preview-content :global(a) {
          color: ${currentTheme.mode === 'light' ? '#0066cc' : '#66b3ff'};
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
        }
        
        .markdown-preview-content :global(a:hover) {
          color: ${themeColors.accent};
          text-decoration: underline;
        }
        
        /* HORIZONTAL RULES */
        .markdown-preview-content :global(hr) {
          border: none;
          height: 1px;
          background: ${themeColors.border};
          margin: 3rem auto;
          max-width: 200px;
        }
        
        /* TABLES - Clean and simple */
        .markdown-preview-content :global(table) {
          width: 100%;
          max-width: 600px;
          margin: 2rem auto;
          border-collapse: collapse;
          border: 1px solid ${themeColors.border};
          border-radius: 0.5rem;
          overflow: hidden;
        }
        
        .markdown-preview-content :global(th),
        .markdown-preview-content :global(td) {
          padding: 0.75rem 1rem;
          text-align: left;
          border-bottom: 1px solid ${themeColors.border};
          font-size: 15px;
        }
        
        .markdown-preview-content :global(th) {
          background: ${currentTheme.mode === 'light' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)'};
          font-weight: 600;
          color: ${themeColors.text};
        }
        
        .markdown-preview-content :global(td) {
          color: ${themeColors.text};
        }
        
        .markdown-preview-content :global(tr:last-child td) {
          border-bottom: none;
        }
        
        /* RESPONSIVE DESIGN */
        @media (max-width: 768px) {
          .preview-container {
            padding: 2rem 1.5rem;
            max-width: 100%;
          }
          
          .markdown-preview-content {
            max-width: 100%;
          }
          
          .markdown-preview-content :global(h1) {
            font-size: 2.5rem;
          }
          
          .markdown-preview-content :global(h2) {
            font-size: 1.75rem;
          }
          
          .markdown-preview-content :global(h3) {
            font-size: 1.375rem;
          }
          
          .markdown-preview-content :global(ul),
          .markdown-preview-content :global(ol),
          .markdown-preview-content :global(p),
          .markdown-preview-content :global(blockquote) {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
// Keep only the first instance on line 87, remove the one on line 96