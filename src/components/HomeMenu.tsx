import React, { useState, useEffect } from 'react';
import { Search, Plus, FileText, Clock, TrendingUp, Pin, User, Edit3, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { Note } from '../types';
import { formatDate, createNewNote, generateId } from '../utils/noteUtils';
import { NoteThumbnail } from './NoteThumbnail';
import { NoteOptionsMenu } from './NoteOptionsMenu';
import { useTheme } from '../contexts/ThemeContext';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface HomeMenuProps {
  notes: Note[];
  searchQuery: string;
  onSelectNote: (noteId: string) => void;
  onCreateNote: () => void;
  onSearchChange: (query: string) => void;
  onUpdateNotes: (notes: Note[]) => void;
  onWorkspaceClick: () => void;
}

export function HomeMenu({ 
  notes, 
  searchQuery, 
  onSelectNote, 
  onCreateNote, 
  onSearchChange,
  onUpdateNotes,
  onWorkspaceClick
}: HomeMenuProps) {
  const { currentTheme } = useTheme();
  const [pinnedNotes, setPinnedNotes] = useLocalStorage<string[]>('pinned-notes', []);
  const [userName, setUserName] = useLocalStorage<string>('user-name', '');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Recent Notes Dropdown State
  const [recentNotesOpen, setRecentNotesOpen] = useState(false);
  
  // Update time every minute to keep greeting accurate
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Get real-time greeting based on current hour
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Get notes count message (WITHOUT name to avoid redundancy)
  const getNotesMessage = () => {
    const totalNotes = notes.length;
    const pinnedCount = pinnedNotes.length;
    
    if (totalNotes === 0) {
      return "Let's create your first Slip";
    }
    
    return `You have ${totalNotes} Slip${totalNotes === 1 ? '' : 's'}${pinnedCount > 0 ? ` • ${pinnedCount} pinned` : ''}`;
  };

  const handleNameEdit = () => {
    setTempName(userName);
    setIsEditingName(true);
  };

  const handleNameSave = () => {
    const trimmedName = tempName.trim();
    if (trimmedName) {
      setUserName(trimmedName);
      toast.success(`Welcome, ${trimmedName}!`);
    }
    setIsEditingName(false);
  };

  const handleNameCancel = () => {
    setTempName('');
    setIsEditingName(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      handleNameCancel();
    }
  };
  
  // Separate pinned and unpinned notes
  const pinnedNotesList = notes.filter(note => pinnedNotes.includes(note.id));
  const unpinnedNotesList = notes.filter(note => !pinnedNotes.includes(note.id));
  
  // Get recent notes (last 6 updated from unpinned)
  const recentNotes = [...unpinnedNotesList]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);

  // Get notes from today
  const today = new Date();
  const todayNotes = notes.filter(note => {
    const noteDate = new Date(note.updatedAt);
    return noteDate.toDateString() === today.toDateString();
  });

  // Filter notes based on search
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.blocks.some(block => block.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleRename = (noteId: string, newTitle: string) => {
    const updatedNotes = notes.map(note => 
      note.id === noteId 
        ? { 
            ...note, 
            title: newTitle,
            // Also update the first block if it's a heading
            blocks: note.blocks.map((block, index) => 
              index === 0 && ['heading1', 'heading2', 'heading3'].includes(block.type)
                ? { ...block, content: newTitle }
                : block
            ),
            updatedAt: new Date()
          }
        : note
    );
    onUpdateNotes(updatedNotes);
  };

  const handlePin = (noteId: string) => {
    setPinnedNotes(prev => [...prev, noteId]);
  };

  const handleUnpin = (noteId: string) => {
    setPinnedNotes(prev => prev.filter(id => id !== noteId));
  };

  const handleDelete = (noteId: string) => {
    const updatedNotes = notes.filter(note => note.id !== noteId);
    onUpdateNotes(updatedNotes);
    // Also remove from pinned if it was pinned
    setPinnedNotes(prev => prev.filter(id => id !== noteId));
  };

  const handleDuplicate = (noteId: string) => {
    const originalNote = notes.find(note => note.id === noteId);
    if (!originalNote) return;

    const duplicatedNote: Note = {
      ...originalNote,
      id: generateId(),
      title: `${originalNote.title} (Copy)`,
      blocks: originalNote.blocks.map(block => ({
        ...block,
        id: generateId(),
        content: block.type === 'heading1' && block === originalNote.blocks[0] 
          ? `${originalNote.title} (Copy)` 
          : block.content
      })),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedNotes = [duplicatedNote, ...notes];
    onUpdateNotes(updatedNotes);
  };

  const handleCreateNote = () => {
    onCreateNote();
    toast.success('New Slip created');
  };

  const renderNoteCard = (note: Note, showPin = false) => (
    <div
      key={note.id}
      className={`${currentTheme.colors.background} rounded-2xl p-6 shadow-sm ${currentTheme.colors.border} border hover:shadow-lg ${currentTheme.colors.borderHover} transition-all duration-200 text-left group transform hover:-translate-y-1 relative cursor-pointer`}
      onClick={() => onSelectNote(note.id)}
    >
      {/* Pin indicator */}
      {showPin && (
        <div className="absolute top-4 left-4 z-10">
          <Pin size={14} className="text-yellow-600 fill-current" />
        </div>
      )}

      {/* Options Menu */}
      <div className="absolute top-4 right-4 z-20" onClick={(e) => e.stopPropagation()}>
        <NoteOptionsMenu
          note={note}
          isPinned={pinnedNotes.includes(note.id)}
          onRename={handleRename}
          onPin={handlePin}
          onUnpin={handleUnpin}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
        />
      </div>

      <div className="mb-4 mt-2">
        <NoteThumbnail note={note} />
      </div>
      <div className="flex items-start justify-between mb-3">
        <FileText size={20} className={currentTheme.colors.textMuted} />
        <span className={`text-xs ${currentTheme.colors.textMuted} ${currentTheme.colors.surface} px-2 py-1 rounded-full`}>
          {formatDate(new Date(note.updatedAt))}
        </span>
      </div>
      <h3 className={`font-semibold ${currentTheme.colors.text} mb-2 ${currentTheme.colors.textSecondary.replace('text-', 'group-hover:text-')} transition-colors pr-12`}>
        {note.title}
      </h3>
      <p className={`text-sm ${currentTheme.colors.textMuted} line-clamp-2`}>
        {note.blocks.find(block => block.content)?.content || 'Empty Slip'}
      </p>
    </div>
  );

  return (
    <div className={`flex-1 overflow-y-auto ${currentTheme.colors.surface}`}>
      <div className="max-w-6xl mx-auto p-8">
        {/* Header with Personalized Greeting */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
              {/* Real-time Greeting with Name Input - ADDED COMMA */}
              <div className="flex items-center space-x-4 mb-4">
                <h1 className={`text-4xl font-bold ${currentTheme.colors.text}`}>
                  {getGreeting()}
                  {userName && (
                    <span className={`${currentTheme.colors.textSecondary} ml-1`}>
                      , {userName}
                    </span>
                  )}
                </h1>
                
                {/* Name Input/Edit Section */}
                <div className="flex items-center space-x-2">
                  {!userName && !isEditingName ? (
                    <button
                      onClick={handleNameEdit}
                      className={`
                        flex items-center space-x-2 px-4 py-2 ${currentTheme.colors.surface} 
                        ${currentTheme.colors.border} border rounded-xl ${currentTheme.colors.surfaceHover} 
                        transition-all duration-200 shadow-sm hover:shadow-md group
                      `}
                      title="Add your name for a personal touch"
                    >
                      <User size={16} className={`${currentTheme.colors.textMuted} group-hover:${currentTheme.colors.textSecondary.replace('text-', 'group-hover:text-')}`} />
                      <span className={`text-sm ${currentTheme.colors.textMuted} group-hover:${currentTheme.colors.textSecondary.replace('text-', 'group-hover:text-')}`}>
                        Add your name
                      </span>
                    </button>
                  ) : isEditingName ? (
                    <div className="flex items-center space-x-2">
                      <div className={`flex items-center ${currentTheme.colors.surface} ${currentTheme.colors.border} border rounded-xl px-3 py-2 shadow-sm`}>
                        <User size={16} className={`${currentTheme.colors.textMuted} mr-2`} />
                        <input
                          type="text"
                          value={tempName}
                          onChange={(e) => setTempName(e.target.value)}
                          onKeyDown={handleNameKeyDown}
                          placeholder="Enter your name"
                          className={`
                            bg-transparent outline-none text-sm ${currentTheme.colors.text} 
                            placeholder:${currentTheme.colors.textMuted} w-32
                          `}
                          autoFocus
                        />
                      </div>
                      <button
                        onClick={handleNameSave}
                        disabled={!tempName.trim()}
                        className={`
                          p-2 ${currentTheme.colors.accent} ${currentTheme.colors.accentText} 
                          rounded-lg ${currentTheme.colors.accentHover} transition-all duration-200 
                          disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md
                        `}
                        title="Save name"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={handleNameCancel}
                        className={`
                          p-2 ${currentTheme.colors.surface} ${currentTheme.colors.border} 
                          border rounded-lg ${currentTheme.colors.surfaceHover} transition-colors 
                          duration-200 ${currentTheme.colors.textMuted}
                        `}
                        title="Cancel"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleNameEdit}
                      className={`
                        flex items-center space-x-2 px-3 py-2 ${currentTheme.colors.surface} 
                        ${currentTheme.colors.border} border rounded-lg ${currentTheme.colors.surfaceHover} 
                        transition-all duration-200 opacity-0 hover:opacity-100 group-hover:opacity-100
                      `}
                      title="Edit your name"
                    >
                      <Edit3 size={14} className={currentTheme.colors.textMuted} />
                    </button>
                  )}
                </div>
              </div>
              
              {/* Notes Count Message */}
              <p className={`text-lg ${currentTheme.colors.textMuted}`}>
                {getNotesMessage()}
              </p>
              
              {/* Current Time Display */}
              <div className="flex items-center space-x-2 mt-2">
                <Clock size={14} className={currentTheme.colors.textMuted} />
                <span className={`text-sm ${currentTheme.colors.textMuted}`}>
                  {currentTime.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                  })} • {currentTime.toLocaleDateString([], { 
                    weekday: 'long',
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${currentTheme.colors.textMuted}`} size={20} />
            <input
              type="text"
              placeholder="Search all Slips..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className={`w-full pl-12 pr-6 py-4 ${currentTheme.colors.background} ${currentTheme.colors.border} border rounded-2xl focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md text-lg`}
            />
          </div>
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="mb-12">
            <h2 className={`text-2xl font-semibold ${currentTheme.colors.text} mb-6 flex items-center`}>
              <Search size={24} className={`mr-3 ${currentTheme.colors.textMuted}`} />
              Search Results
            </h2>
            {filteredNotes.length === 0 ? (
              <div className={`${currentTheme.colors.background} rounded-2xl p-8 shadow-sm ${currentTheme.colors.border} border text-center`}>
                <div className={`w-16 h-16 ${currentTheme.colors.surface} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <Search size={24} className={currentTheme.colors.textMuted} />
                </div>
                <h3 className={`text-lg font-medium ${currentTheme.colors.text} mb-2`}>No results found</h3>
                <p className={currentTheme.colors.textMuted}>Try searching with different keywords</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNotes.map((note) => renderNoteCard(note, pinnedNotes.includes(note.id)))}
              </div>
            )}
          </div>
        )}

        {/* Quick Actions - BIG CARDS: Create New Note + Workspace */}
        {!searchQuery && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Create New Note - Big Card */}
            <button
              onClick={handleCreateNote}
              className={`${currentTheme.colors.accent} ${currentTheme.colors.accentText} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 text-left group transform hover:-translate-y-1 ${currentTheme.colors.accentHover}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-black bg-opacity-20 rounded-xl flex items-center justify-center`}>
                  <Plus size={24} className="text-current" />
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-current">
                  →
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Create New Slip</h3>
              <p className="text-current opacity-80 text-sm">Start writing your thoughts</p>
            </button>

            {/* Workspace - Big Card */}
            <button
              onClick={onWorkspaceClick}
              className={`${currentTheme.colors.surface} ${currentTheme.colors.text} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 text-left group transform hover:-translate-y-1 ${currentTheme.colors.border} border ${currentTheme.colors.surfaceHover}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${currentTheme.colors.background} rounded-xl flex items-center justify-center`}>
                  <Edit3 size={24} className={currentTheme.colors.textSecondary} />
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className={`text-sm ${currentTheme.colors.textMuted}`}>
                    →
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Workspace</h3>
              <p className={`${currentTheme.colors.textMuted} text-sm`}>Quick access to your editor</p>
            </button>
          </div>
        )}

        {/* Stats Cards - Total Notes + Today */}
        {!searchQuery && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Total Notes */}
            <div className={`${currentTheme.colors.background} ${currentTheme.colors.text} rounded-2xl p-6 shadow-lg ${currentTheme.colors.border} border`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${currentTheme.colors.surface} rounded-xl flex items-center justify-center`}>
                  <TrendingUp size={24} className={currentTheme.colors.textSecondary} />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Total Slips</h3>
              <p className={`${currentTheme.colors.textMuted} text-sm`}>{notes.length} Slips created</p>
            </div>

            {/* Today */}
            <div className={`${currentTheme.colors.surface} ${currentTheme.colors.text} rounded-2xl p-6 shadow-lg ${currentTheme.colors.border} border`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${currentTheme.colors.background} rounded-xl flex items-center justify-center`}>
                  <Clock size={24} className={currentTheme.colors.textSecondary} />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Today</h3>
              <p className={`${currentTheme.colors.textMuted} text-sm`}>{todayNotes.length} Slips updated</p>
            </div>
          </div>
        )}

        {/* Pinned Notes - RESTORED */}
        {!searchQuery && pinnedNotesList.length > 0 && (
          <div className="mb-12">
            <h2 className={`text-2xl font-semibold ${currentTheme.colors.text} mb-6 flex items-center`}>
              <Pin size={24} className={`mr-3 text-yellow-600`} />
              Pinned Slips
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pinnedNotesList.map((note) => renderNoteCard(note, true))}
            </div>
          </div>
        )}

        {/* Recent Notes - DROPDOWN SECTION */}
        {!searchQuery && recentNotes.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-semibold ${currentTheme.colors.text} flex items-center`}>
                <Clock size={24} className={`mr-3 ${currentTheme.colors.textMuted}`} />
                Recent Slips
              </h2>
              
              {/* Dropdown Toggle */}
              <button
                onClick={() => setRecentNotesOpen(!recentNotesOpen)}
                className={`
                  flex items-center space-x-2 px-4 py-2 ${currentTheme.colors.surface} 
                  ${currentTheme.colors.border} border rounded-xl ${currentTheme.colors.surfaceHover} 
                  transition-all duration-200 shadow-sm hover:shadow-md
                `}
              >
                <span className={`text-sm font-medium ${currentTheme.colors.textSecondary}`}>
                  {recentNotesOpen ? 'Hide' : 'Show'} ({recentNotes.length})
                </span>
                {recentNotesOpen ? (
                  <ChevronUp size={16} className={currentTheme.colors.textMuted} />
                ) : (
                  <ChevronDown size={16} className={currentTheme.colors.textMuted} />
                )}
              </button>
            </div>

            {/* Dropdown Content - NOTES LIST ONLY */}
            {recentNotesOpen && (
              <div className={`${currentTheme.colors.background} rounded-2xl p-4 shadow-sm ${currentTheme.colors.border} border mb-8`}>
                <div className="space-y-2">
                  {recentNotes.map((note) => (
                    <div
                      key={note.id}
                      className={`
                        p-3 rounded-lg transition-all duration-200 group relative
                        ${currentTheme.colors.surfaceHover} hover:shadow-sm cursor-pointer
                      `}
                      onClick={() => onSelectNote(note.id)}
                    >
                      {/* Options Menu - RESTORED ORIGINAL HOVER BEHAVIOR */}
                      <div className="absolute top-2 right-2 z-20" onClick={(e) => e.stopPropagation()}>
                        <NoteOptionsMenu
                          note={note}
                          isPinned={pinnedNotes.includes(note.id)}
                          onRename={handleRename}
                          onPin={handlePin}
                          onUnpin={handleUnpin}
                          onDelete={handleDelete}
                          onDuplicate={handleDuplicate}
                        />
                      </div>

                      <div className="pr-12">
                        <h3 className={`font-medium truncate ${currentTheme.colors.text}`}>
                          {note.title}
                        </h3>
                        <p className={`text-sm mt-1 ${currentTheme.colors.textMuted}`}>
                          {formatDate(new Date(note.updatedAt))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SEPARATE PREVIEW WINDOW - COMPLETELY OUTSIDE DROPDOWN */}
        {!searchQuery && recentNotes.length > 0 && (
          <div className="mb-12">
            <div className={`${currentTheme.colors.surface} rounded-2xl p-6 shadow-sm ${currentTheme.colors.border} border`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-semibold ${currentTheme.colors.text}`}>
                  Quick Preview
                </h3>
                <span className={`text-sm ${currentTheme.colors.textMuted}`}>
                  Recent Slips for quick access
                </span>
              </div>
              
              {/* Show at most 3 notes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentNotes.slice(0, 3).map((note) => (
                  <button
                    key={note.id}
                    onClick={() => onSelectNote(note.id)}
                    className={`
                      p-4 text-left rounded-xl border transition-all duration-200 group
                      ${currentTheme.colors.background} ${currentTheme.colors.border}
                      ${currentTheme.colors.surfaceHover} hover:shadow-md hover:scale-102
                    `}
                  >
                    {/* Mini Thumbnail */}
                    <div className="mb-3">
                      <div className="h-16 w-full">
                        <NoteThumbnail note={note} />
                      </div>
                    </div>
                    
                    {/* Note Info */}
                    <h4 className={`font-medium ${currentTheme.colors.text} mb-1 truncate`}>
                      {note.title}
                    </h4>
                    <p className={`text-xs ${currentTheme.colors.textMuted} mb-2`}>
                      {formatDate(new Date(note.updatedAt))}
                    </p>
                    <p className={`text-xs ${currentTheme.colors.textMuted} line-clamp-2`}>
                      {note.blocks.find(block => block.content)?.content || 'Empty Slip'}
                    </p>
                    
                    {/* Hover indicator */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-2">
                      <div className={`text-xs ${currentTheme.colors.textSecondary} font-medium`}>
                        Click to open →
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* "+ x more" indicator if there are more than 3 notes */}
              {recentNotes.length > 3 && (
                <div className="mt-4 text-center">
                  <span className={`text-sm ${currentTheme.colors.textMuted}`}>
                    + {recentNotes.length - 3} more recent Slip{recentNotes.length - 3 === 1 ? '' : 's'}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!searchQuery && notes.length === 0 && (
          <div className="text-center py-16">
            <div className={`w-24 h-24 ${currentTheme.colors.surface} rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg`}>
              <FileText size={32} className={currentTheme.colors.textMuted} />
            </div>
            <h2 className={`text-3xl font-bold ${currentTheme.colors.text} mb-4`}>
              Welcome to your Slips{userName && `, ${userName}`}
            </h2>
            <p className={`text-lg ${currentTheme.colors.textMuted} mb-8 max-w-md mx-auto`}>
              Create your first Slip to start organizing your thoughts and ideas in a beautiful, distraction-free environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleCreateNote}
                className={`inline-flex items-center px-8 py-4 ${currentTheme.colors.accent} ${currentTheme.colors.accentText} font-medium rounded-xl ${currentTheme.colors.accentHover} transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
              >
                <Plus size={20} className="mr-2" />
                Create your first Slip
              </button>
              <button
                onClick={onWorkspaceClick}
                className={`inline-flex items-center px-8 py-4 ${currentTheme.colors.surface} ${currentTheme.colors.border} border font-medium rounded-xl ${currentTheme.colors.surfaceHover} transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${currentTheme.colors.textSecondary}`}
              >
                <Edit3 size={20} className="mr-2" />
                Go to workspace
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}