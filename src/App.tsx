import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TipTapEditor } from './components/TipTapEditor';
import { HomeMenu } from './components/HomeMenu';
import { ThemeMenu } from './components/ThemeMenu';
import { SettingsMenu } from './components/SettingsMenu';
import { HelpSupportMenu } from './components/HelpSupportMenu';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTheme } from './contexts/ThemeContext';
import { Note } from './types';
import { createNewNote } from './utils/noteUtils';
import { FileText, Plus, Edit3 } from 'lucide-react';

function App() {
  const [notes, setNotes] = useLocalStorage<Note[]>('notion-notes', []);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showHome, setShowHome] = useState(true);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const { currentTheme } = useTheme();

  // Initialize with a welcome note if no notes exist
  useEffect(() => {
    if (notes.length === 0) {
      const welcomeNote = createNewNote();
      welcomeNote.title = 'Welcome to Slip';
      welcomeNote.blocks = [
        {
          id: 'welcome-heading',
          type: 'heading1',
          content: 'Welcome to Slip'
        },
        {
          id: 'welcome-intro',
          type: 'paragraph',
          content: 'Your beautiful, distraction-free note-taking space. Start writing below or create a new Slip to begin organizing your thoughts.'
        },
        {
          id: 'welcome-features',
          type: 'heading2',
          content: 'Getting Started'
        },
        {
          id: 'feature-1',
          type: 'bulletList',
          content: 'Create headings by typing # followed by space'
        },
        {
          id: 'feature-2',
          type: 'bulletList',
          content: 'Make bullet lists by typing - followed by space'
        },
        {
          id: 'feature-3',
          type: 'bulletList',
          content: 'Create numbered lists by typing 1. followed by space'
        },
        {
          id: 'feature-4',
          type: 'bulletList',
          content: 'Use Enter to create new lines and blocks'
        },
        {
          id: 'feature-5',
          type: 'bulletList',
          content: 'Customize themes from the sidebar'
        },
        {
          id: 'feature-6',
          type: 'bulletList',
          content: 'Right-click Slips for options like pin, rename, and delete'
        },
        {
          id: 'feature-7',
          type: 'bulletList',
          content: 'Use the Workspace for quick access to the editor'
        },
        {
          id: 'welcome-start',
          type: 'paragraph',
          content: 'Happy note-taking! ✨'
        }
      ];
      setNotes([welcomeNote]);
      setShowHome(true);
    }
  }, [notes, setNotes]);

  const handleCreateNote = () => {
    const newNote = createNewNote();
    setNotes(prev => [newNote, ...prev]);
    setSelectedNoteId(newNote.id);
    setShowHome(false);
    setSidebarOpen(false);
  };

  const handleSelectNote = (noteId: string) => {
    setSelectedNoteId(noteId);
    setShowHome(false);
    setSidebarOpen(false);
  };

  const handleUpdateNote = (updatedNote: Note) => {
    setNotes(prev => prev.map(note => 
      note.id === updatedNote.id ? updatedNote : note
    ));
  };

  const handleUpdateNotes = (updatedNotes: Note[]) => {
    setNotes(updatedNotes);
    
    if (updatedNotes.length === 0) {
      setShowHome(true);
      setSelectedNoteId(null);
    }
    
    if (selectedNoteId && !updatedNotes.find(note => note.id === selectedNoteId)) {
      setShowHome(true);
      setSelectedNoteId(null);
    }
  };

  const handleToggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const handleHomeClick = () => {
    setShowHome(true);
    setSelectedNoteId(null);
    setSearchQuery('');
    setSidebarOpen(false);
  };

  // Workspace = Quick shortcut to the main editor area (where notes live)
  const handleWorkspaceClick = () => {
    // If there are notes, select the first one to show the editor area
    if (notes.length > 0) {
      setSelectedNoteId(notes[0].id);
    } else {
      // If no notes exist, create one
      handleCreateNote();
      return;
    }
    
    setShowHome(false);
    setSidebarOpen(false);
  };

  const selectedNote = notes.find(note => note.id === selectedNoteId);

  return (
    <div className={`h-screen ${currentTheme.colors.background} flex overflow-hidden`}>
      <Sidebar
        notes={notes}
        selectedNoteId={selectedNoteId}
        searchQuery={searchQuery}
        sidebarOpen={sidebarOpen}
        showHome={showHome}
        onSelectNote={handleSelectNote}
        onCreateNote={handleCreateNote}
        onSearchChange={setSearchQuery}
        onToggleSidebar={handleToggleSidebar}
        onHomeClick={handleHomeClick}
        onThemeClick={() => setShowThemeMenu(true)}
      />

      <main className="flex-1 flex flex-col min-w-0 main-content-scroll">
        {showHome ? (
          <HomeMenu
            notes={notes}
            searchQuery={searchQuery}
            onSelectNote={handleSelectNote}
            onCreateNote={handleCreateNote}
            onSearchChange={setSearchQuery}
            onUpdateNotes={handleUpdateNotes}
            onWorkspaceClick={handleWorkspaceClick}
          />
        ) : selectedNote ? (
          <div className="flex-1 overflow-y-auto main-content-scroll">
            <TipTapEditor
              note={selectedNote}
              onUpdateNote={handleUpdateNote}
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-8 max-w-md">
              <div className={`w-24 h-24 ${currentTheme.colors.surface} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm`}>
                <FileText size={32} className={currentTheme.colors.textMuted} />
              </div>
              <h2 className={`text-2xl font-bold ${currentTheme.colors.text} mb-3`}>
                Select a Slip to continue
              </h2>
              <p className={`${currentTheme.colors.textMuted} mb-6 leading-relaxed`}>
                Choose a Slip from the sidebar, use the workspace for quick access, or create a new Slip to start writing.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleCreateNote}
                  className={`inline-flex items-center px-6 py-3 ${currentTheme.colors.accent} ${currentTheme.colors.accentText} font-medium rounded-lg ${currentTheme.colors.accentHover} transition-colors duration-200 shadow-md hover:shadow-lg`}
                >
                  <Plus size={20} className="mr-2" />
                  Create new Slip
                </button>
                <button
                  onClick={handleWorkspaceClick}
                  className={`inline-flex items-center px-6 py-3 ${currentTheme.colors.surface} ${currentTheme.colors.border} border font-medium rounded-lg ${currentTheme.colors.surfaceHover} transition-colors duration-200 shadow-sm hover:shadow-md ${currentTheme.colors.textSecondary}`}
                >
                  <Edit3 size={20} className="mr-2" />
                  Go to workspace
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Theme Menu */}
      <ThemeMenu 
        isOpen={showThemeMenu} 
        onClose={() => setShowThemeMenu(false)} 
      />

      {/* Settings Menu */}
      <SettingsMenu 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />

      {/* Help & Support Menu */}
      <HelpSupportMenu 
        isOpen={showHelp} 
        onClose={() => setShowHelp(false)} 
      />
    </div>
  );
}

export default App;