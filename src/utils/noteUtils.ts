import { Note, Block } from '../types';

export function createNewNote(): Note {
  const now = new Date();
  return {
    id: generateId(),
    title: 'Untitled',
    blocks: [
      {
        id: generateId(),
        type: 'heading1',
        content: 'Untitled'
      },
      {
        id: generateId(),
        type: 'paragraph',
        content: ''
      }
    ],
    createdAt: now,
    updatedAt: now
  };
}

export function createNewBlock(type: Block['type']): Block {
  return {
    id: generateId(),
    type,
    content: ''
  };
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function formatDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours === 0) {
      const minutes = Math.floor(diff / (1000 * 60));
      return minutes <= 1 ? 'Just now' : `${minutes}m ago`;
    }
    return hours === 1 ? '1h ago' : `${hours}h ago`;
  } else if (days === 1) {
    return 'Yesterday';
  } else if (days < 7) {
    return `${days}d ago`;
  } else {
    return date.toLocaleDateString();
  }
}