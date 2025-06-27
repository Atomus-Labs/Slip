import React, { useState } from 'react';
import { Search, Plus, Menu, X, FileText, Home, Palette, Settings, HelpCircle } from 'lucide-react';
import { Note } from '../types';
import { formatDate } from '../utils/noteUtils';
import { useTheme } from '../contexts/ThemeContext';
import { SlipLogo } from './SlipLogo';
import { SettingsMenu } from './SettingsMenu';
import { HelpSupportMenu } from './HelpSupportMenu';

interface SidebarProps {
  notes: Note[];
  selectedNoteId: string | null;
  searchQuery: string;
  sidebarOpen: boolean;
  showHome: boolean;
  onSelectNote: (noteId: string) => void;
  onCreateNote: () => void;
  onSearchChange: (query: string) => void;
  onToggleSidebar: () => void;
  onHomeClick: () => void;
  onThemeClick: () => void;
}

export function Sidebar({
  notes,
  selectedNoteId,
  searchQuery,
  sidebarOpen,
  showHome,
  onSelectNote,
  onCreateNote,
  onSearchChange,
  onToggleSidebar,
  onHomeClick,
  onThemeClick
}: SidebarProps) {
  const { currentTheme } = useTheme();
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.blocks.some(block => block.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Bottom section icons - Help & Support first, then Settings, then Themes
  const bottomIcons = [
    {
      icon: HelpCircle,
      label: 'Help & Support',
      action: () => setShowHelp(true),
      tooltip: 'Help & support'
    },
    {
      icon: Settings,
      label: 'Settings',
      action: () => setShowSettings(true),
      tooltip: 'App settings'
    },
    {
      icon: Palette,
      label: 'Themes',
      action: onThemeClick,
      tooltip: 'Customize themes'
    }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={onToggleSidebar}
        />
      )}
      
      {/* Mobile toggle button */}
      <button
        onClick={onToggleSidebar}
        className={`lg:hidden fixed top-4 left-4 z-50 p-2 ${currentTheme.colors.surface} rounded-lg shadow-lg ${currentTheme.colors.border} border ${currentTheme.colors.surfaceHover} transition-colors duration-200`}
      >
        {sidebarOpen ? <X size={20} className={currentTheme.colors.textSecondary} /> : <Menu size={20} className={currentTheme.colors.textSecondary} />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed lg:relative top-0 left-0 h-full w-80 ${currentTheme.colors.surface} ${currentTheme.colors.border} border-r z-50
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={`p-6 ${currentTheme.colors.border} border-b flex-shrink-0`}>
            <div className={`flex items-center justify-between mb-6`}>
              {/* Slip Logo */}
              <div className="flex items-center flex-1">
                <SlipLogo size="xxxxl" />
              </div>
            </div>
            
            {/* Navigation */}
            <div className="mb-4 space-y-1">
              <button
                onClick={onHomeClick}
                className={`
                  w-full flex items-center px-3 py-2 rounded-lg transition-all duration-200 text-left
                  ${showHome 
                    ? `${currentTheme.colors.surfaceActive} ${currentTheme.colors.text} ${currentTheme.colors.border} border shadow-sm` 
                    : `${currentTheme.colors.textSecondary} ${currentTheme.colors.surfaceHover} hover:shadow-sm border border-transparent ${currentTheme.colors.borderHover}`
                  }
                `}
              >
                <Home size={16} className="mr-3" />
                Home
              </button>
            </div>
            
            {/* Search - ONLY SHOW WHEN NOT ON HOME */}
            {!showHome && (
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${currentTheme.colors.textMuted}`} size={16} />
                <input
                  type="text"
                  placeholder="Search Slips..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 ${currentTheme.colors.background} ${currentTheme.colors.border} border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200`}
                  style={{
                    focusRingColor: currentTheme.colors.accent.replace('bg-', '')
                  }}
                />
              </div>
            )}
          </div>

          {/* Content Area - CONDITIONAL BASED ON showHome */}
          <div className="flex-1 overflow-y-auto sidebar-scroll">
            {showHome ? (
              /* HOME MODE - Welcome Text CENTERED VERTICALLY */
              <div className={`h-full flex items-center justify-center p-6 text-center ${currentTheme.colors.textMuted}`}>
                <div>
                  <div className={`w-16 h-16 ${currentTheme.colors.surface} rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm ${currentTheme.colors.border} border`}>
                    <Home size={24} className={currentTheme.colors.textMuted} />
                  </div>
                  <h3 className={`font-medium mb-2 ${currentTheme.colors.text}`}>Welcome Home</h3>
                  <p className="text-sm leading-relaxed">
                    Your beautiful workspace for organizing thoughts and ideas. Create Slips, explore themes, and make this space truly yours.
                  </p>
                </div>
              </div>
            ) : (
              /* EDITOR MODE - Notes List */
              <>
                {/* Notes Header */}
                <div className={`px-6 py-4 ${currentTheme.colors.border} border-b`}>
                  <div className="flex items-center justify-between">
                    <h3 className={`text-sm font-semibold ${currentTheme.colors.text}`}>
                      All Slips
                    </h3>
                    <span className={`text-xs ${currentTheme.colors.textMuted} ${currentTheme.colors.surface} px-2 py-1 rounded-full`}>
                      {filteredNotes.length}
                    </span>
                  </div>
                </div>

                {filteredNotes.length === 0 ? (
                  <div className={`p-6 text-center ${currentTheme.colors.textMuted}`}>
                    {searchQuery ? (
                      <>
                        <Search size={24} className={`mx-auto mb-3 ${currentTheme.colors.textMuted}`} />
                        <p className="font-medium mb-1">No results found</p>
                        <p className="text-sm">Try a different search term</p>
                      </>
                    ) : (
                      <>
                        <FileText size={24} className={`mx-auto mb-3 ${currentTheme.colors.textMuted}`} />
                        <p className="font-medium mb-1">No Slips yet</p>
                        <p className="text-sm">Create your first Slip to get started</p>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="p-3 space-y-1 pb-24"> {/* Added bottom padding for bottom icons */}
                    {filteredNotes.map((note) => (
                      <button
                        key={note.id}
                        onClick={() => onSelectNote(note.id)}
                        className={`
                          w-full p-3 text-left rounded-lg transition-all duration-200 group
                          ${selectedNoteId === note.id && !showHome
                            ? `${currentTheme.colors.surfaceActive} ${currentTheme.colors.border} border shadow-sm` 
                            : `${currentTheme.colors.surfaceHover} hover:shadow-sm border border-transparent ${currentTheme.colors.borderHover}`
                          }
                        `}
                      >
                        <div className="flex items-start space-x-3">
                          <FileText 
                            size={16} 
                            className={`mt-0.5 flex-shrink-0 ${selectedNoteId === note.id && !showHome ? currentTheme.colors.textSecondary : `${currentTheme.colors.textMuted} group-hover:${currentTheme.colors.textSecondary.replace('text-', 'group-hover:text-')}`}`}
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-medium truncate ${selectedNoteId === note.id && !showHome ? currentTheme.colors.text : currentTheme.colors.text}`}>
                              {note.title}
                            </h3>
                            <p className={`text-sm ${currentTheme.colors.textMuted} mt-1 line-clamp-2`}>
                              {note.blocks.find(block => block.content)?.content || 'Empty Slip'}
                            </p>
                            <p className={`text-xs ${currentTheme.colors.textMuted} mt-2`}>
                              {formatDate(new Date(note.updatedAt))}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Bottom Icons Section */}
          <div className={`p-6 ${currentTheme.colors.border} border-t flex-shrink-0`}>
            <div className="flex items-center justify-center space-x-4">
              {bottomIcons.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    onClick={item.action}
                    className={`
                      group relative p-2 rounded-lg transition-all duration-200 shadow-sm border border-transparent
                      ${currentTheme.colors.textMuted} ${currentTheme.colors.surfaceHover} ${currentTheme.colors.borderHover}
                    `}
                    title={item.tooltip}
                  >
                    <Icon size={20} />
                    
                    {/* Tooltip */}
                    <div className={`
                      absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-2 
                      ${currentTheme.colors.surface} ${currentTheme.colors.border} border rounded-lg 
                      text-xs ${currentTheme.colors.text} whitespace-nowrap opacity-0 
                      group-hover:opacity-100 transition-opacity duration-200 pointer-events-none
                      shadow-lg z-10
                    `}>
                      {item.label}
                      <div className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent`} 
                           style={{ borderTopColor: currentTheme.colors.surface.includes('bg-') ? currentTheme.colors.surface.replace('bg-', '#') : '#ffffff' }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Settings and Help menus */}
      {showSettings && (
        <div className="fixed inset-0 z-[60]">
          <SettingsMenu
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
          />
        </div>
      )}

      {showHelp && (
        <div className="fixed inset-0 z-[60]">
          <HelpSupportMenu
            isOpen={showHelp}
            onClose={() => setShowHelp(false)}
          />
        </div>
      )}
    </>
  );
}