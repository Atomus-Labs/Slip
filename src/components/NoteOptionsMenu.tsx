import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit3, Pin, PinOff, Trash2, Copy, Calendar, FileText, X, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '../contexts/ThemeContext';
import { Note } from '../types';

interface NoteOptionsMenuProps {
  note: Note;
  isPinned: boolean;
  onRename: (noteId: string, newTitle: string) => void;
  onPin: (noteId: string) => void;
  onUnpin: (noteId: string) => void;
  onDelete: (noteId: string) => void;
  onDuplicate: (noteId: string) => void;
}

export function NoteOptionsMenu({ 
  note, 
  isPinned, 
  onRename, 
  onPin, 
  onUnpin, 
  onDelete, 
  onDuplicate 
}: NoteOptionsMenuProps) {
  const { currentTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [newTitle, setNewTitle] = useState(note.title);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close menu on escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setShowRenameModal(false);
        setShowDeleteConfirm(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleRename = () => {
    if (newTitle.trim() && newTitle.trim() !== note.title) {
      onRename(note.id, newTitle.trim());
      toast.success('Slip renamed successfully');
    }
    setShowRenameModal(false);
    setIsOpen(false);
  };

  const handleDelete = () => {
    onDelete(note.id);
    toast.success('Slip deleted');
    setShowDeleteConfirm(false);
    setIsOpen(false);
  };

  const handlePin = () => {
    onPin(note.id);
    toast.success('Slip pinned to top');
    setIsOpen(false);
  };

  const handleUnpin = () => {
    onUnpin(note.id);
    toast.success('Slip unpinned');
    setIsOpen(false);
  };

  const handleDuplicate = () => {
    onDuplicate(note.id);
    toast.success('Slip duplicated');
    setIsOpen(false);
  };

  const menuItems = [
    {
      icon: Edit3,
      label: 'Rename',
      action: () => {
        setNewTitle(note.title);
        setShowRenameModal(true);
        setIsOpen(false);
      },
      color: currentTheme.colors.textSecondary
    },
    {
      icon: isPinned ? PinOff : Pin,
      label: isPinned ? 'Unpin' : 'Pin to top',
      action: isPinned ? handleUnpin : handlePin,
      color: isPinned ? 'text-yellow-600' : currentTheme.colors.textSecondary
    },
    {
      icon: Copy,
      label: 'Duplicate',
      action: handleDuplicate,
      color: currentTheme.colors.textSecondary
    },
    {
      icon: Trash2,
      label: 'Delete',
      action: () => {
        setShowDeleteConfirm(true);
        setIsOpen(false);
      },
      color: 'text-red-500',
      dangerous: true
    }
  ];

  return (
    <>
      {/* Options Button */}
      <div className="relative">
        <button
          ref={buttonRef}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className={`
            p-3 rounded-xl transition-all duration-200 
            ${currentTheme.colors.surface} ${currentTheme.colors.border} border
            ${currentTheme.colors.surfaceHover} ${currentTheme.colors.textSecondary}
            hover:${currentTheme.colors.textSecondary} hover:shadow-lg
            opacity-0 group-hover:opacity-100 focus:opacity-100 
            focus:outline-none focus:ring-2 focus:ring-opacity-50
            shadow-md hover:shadow-xl transform hover:scale-105
          `}
          title="Slip options"
        >
          <MoreVertical size={18} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            ref={menuRef}
            className={`
              absolute right-0 top-full mt-2 w-48 ${currentTheme.colors.surface} 
              ${currentTheme.colors.border} border rounded-xl shadow-xl z-50
              animate-in fade-in slide-in-from-top-2 duration-200
            `}
          >
            <div className="py-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      item.action();
                    }}
                    className={`
                      w-full flex items-center px-4 py-3 text-left transition-colors duration-150
                      ${currentTheme.colors.surfaceHover} ${item.dangerous ? 'hover:bg-red-50' : ''}
                      ${item.color} ${item.dangerous ? 'hover:text-red-600' : `hover:${currentTheme.colors.textSecondary}`}
                    `}
                  >
                    <Icon size={16} className="mr-3 flex-shrink-0" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Note Info Footer */}
            <div className={`px-4 py-3 ${currentTheme.colors.border} border-t`}>
              <div className="flex items-center space-x-2 text-xs">
                <Calendar size={12} className={currentTheme.colors.textMuted} />
                <span className={currentTheme.colors.textMuted}>
                  Updated {new Date(note.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs mt-1">
                <FileText size={12} className={currentTheme.colors.textMuted} />
                <span className={currentTheme.colors.textMuted}>
                  {note.blocks.length} block{note.blocks.length === 1 ? '' : 's'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Rename Modal */}
      {showRenameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
          <div className={`${currentTheme.colors.surface} rounded-2xl shadow-2xl max-w-md w-full`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${currentTheme.colors.text}`}>
                  Rename Slip
                </h3>
                <button
                  onClick={() => setShowRenameModal(false)}
                  className={`p-2 ${currentTheme.colors.textMuted} ${currentTheme.colors.surfaceHover} rounded-lg transition-colors duration-200`}
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className="mb-6">
                <label className={`block text-sm font-medium ${currentTheme.colors.textSecondary} mb-2`}>
                  Slip title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleRename();
                    }
                  }}
                  className={`
                    w-full px-4 py-3 ${currentTheme.colors.background} ${currentTheme.colors.border} 
                    border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 
                    focus:border-transparent transition-all duration-200 ${currentTheme.colors.text}
                  `}
                  placeholder="Enter Slip title..."
                  autoFocus
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleRename}
                  disabled={!newTitle.trim() || newTitle.trim() === note.title}
                  className={`
                    flex-1 py-3 px-4 ${currentTheme.colors.accent} ${currentTheme.colors.accentText} 
                    font-medium rounded-lg ${currentTheme.colors.accentHover} transition-all duration-200 
                    disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg
                  `}
                >
                  Rename
                </button>
                <button
                  onClick={() => setShowRenameModal(false)}
                  className={`
                    px-4 py-3 ${currentTheme.colors.surface} ${currentTheme.colors.border} 
                    border rounded-lg ${currentTheme.colors.surfaceHover} transition-colors 
                    duration-200 font-medium ${currentTheme.colors.textSecondary}
                  `}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[70] flex items-center justify-center p-4">
          <div className={`${currentTheme.colors.surface} rounded-3xl shadow-2xl w-full max-w-lg mx-auto`}>
            
            {/* Header */}
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={36} className="text-red-600" />
              </div>
              
              <h2 className={`text-2xl font-bold ${currentTheme.colors.text} mb-3`}>
                Delete this Slip?
              </h2>
              
              <p className={`text-lg ${currentTheme.colors.textMuted} mb-6`}>
                This action cannot be undone. All content will be permanently removed.
              </p>

              {/* Note Preview */}
              <div className={`${currentTheme.colors.background} rounded-2xl p-4 mb-6 text-left`}>
                <div className="flex items-center space-x-3 mb-3">
                  <FileText size={20} className={currentTheme.colors.textMuted} />
                  <h3 className={`font-semibold ${currentTheme.colors.text} truncate flex-1`}>
                    {note.title}
                  </h3>
                </div>
                
                <p className={`text-sm ${currentTheme.colors.textMuted} line-clamp-2 mb-3`}>
                  {note.blocks.find(block => block.content)?.content || 'This Slip is empty'}
                </p>
                
                <div className="flex items-center justify-between text-xs">
                  <span className={currentTheme.colors.textMuted}>
                    {note.blocks.length} block{note.blocks.length === 1 ? '' : 's'}
                  </span>
                  <span className={currentTheme.colors.textMuted}>
                    Updated {new Date(note.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-8 pb-8">
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className={`
                    flex-1 py-4 px-6 ${currentTheme.colors.surface} ${currentTheme.colors.border} 
                    border-2 rounded-2xl ${currentTheme.colors.surfaceHover} transition-all duration-200 
                    font-semibold ${currentTheme.colors.textSecondary} hover:shadow-md
                  `}
                >
                  Cancel
                </button>
                
                <button
                  onClick={handleDelete}
                  className="flex-1 py-4 px-6 bg-red-500 text-white font-semibold rounded-2xl hover:bg-red-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Delete Slip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}