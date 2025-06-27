import React, { useRef, useEffect } from 'react';
import { HelpCircle, X, Book, MessageCircle, Mail, FileText, Video, Zap, Search, ExternalLink } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface HelpSupportMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpSupportMenu({ isOpen, onClose }: HelpSupportMenuProps) {
  const { currentTheme } = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const helpSections = [
    {
      title: 'Getting Started',
      icon: Zap,
      items: [
        { 
          label: 'Quick Start Guide', 
          description: 'Learn the basics in 5 minutes',
          icon: Book
        },
        { 
          label: 'Creating Your First Slip', 
          description: 'Step-by-step tutorial',
          icon: FileText
        },
        { 
          label: 'Keyboard Shortcuts', 
          description: 'Speed up your workflow',
          icon: Zap
        }
      ]
    },
    {
      title: 'Features & Tips',
      icon: Book,
      items: [
        { 
          label: 'Block Editor Guide', 
          description: 'Master the block-based editor',
          icon: FileText
        },
        { 
          label: 'Organization Tips', 
          description: 'Best practices for Slip organization',
          icon: Book
        },
        { 
          label: 'Search & Navigation', 
          description: 'Find your Slips quickly',
          icon: Search
        }
      ]
    },
    {
      title: 'Video Tutorials',
      icon: Video,
      items: [
        { 
          label: 'Getting Started Video', 
          description: '10-minute overview of key features',
          icon: Video
        },
        { 
          label: 'Advanced Features', 
          description: 'Deep dive into powerful capabilities',
          icon: Video
        },
        { 
          label: 'Tips & Tricks', 
          description: 'Pro tips from power users',
          icon: Video
        }
      ]
    }
  ];

  const supportOptions = [
    {
      title: 'Contact Support',
      description: 'Get help from our support team',
      icon: Mail,
      action: 'mailto:support@slip.app',
      external: true
    },
    {
      title: 'Community Forum',
      description: 'Connect with other users',
      icon: MessageCircle,
      action: 'https://community.slip.app',
      external: true
    },
    {
      title: 'Feature Requests',
      description: 'Suggest new features',
      icon: Zap,
      action: 'https://feedback.slip.app',
      external: true
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div
        ref={menuRef}
        className={`${currentTheme.colors.surface} ${currentTheme.colors.border} border rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col`}
      >
        {/* Header */}
        <div className={`${currentTheme.colors.border} border-b p-6 flex-shrink-0`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`${currentTheme.colors.accent} p-2 rounded-lg`}>
                <HelpCircle size={20} className={currentTheme.colors.accentText} />
              </div>
              <div>
                <h2 className={`text-xl font-semibold ${currentTheme.colors.text}`}>
                  Help & Support
                </h2>
                <p className={`text-sm ${currentTheme.colors.textMuted}`}>
                  Get help and learn how to make the most of your Slips
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 ${currentTheme.colors.textMuted} ${currentTheme.colors.surfaceHover} rounded-lg transition-colors duration-200 hover:scale-105`}
              title="Close help"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Help Content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-6 space-y-8">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {supportOptions.map((option, index) => {
                const Icon = option.icon;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      if (option.external) {
                        // Placeholder for external links
                        console.log(`Opening: ${option.action}`);
                      }
                    }}
                    className={`
                      p-6 text-left rounded-xl border transition-all duration-200 group
                      ${currentTheme.colors.accent} ${currentTheme.colors.accentText}
                      hover:shadow-lg hover:scale-105 transform
                    `}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                        <Icon size={24} className="text-current" />
                      </div>
                      {option.external && (
                        <ExternalLink size={16} className="text-current opacity-60" />
                      )}
                    </div>
                    <h3 className="font-semibold mb-2">{option.title}</h3>
                    <p className="text-current opacity-80 text-sm">{option.description}</p>
                  </button>
                );
              })}
            </div>

            {/* Help Sections */}
            {helpSections.map((section) => {
              const SectionIcon = section.icon;
              return (
                <div key={section.title} className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className={`${currentTheme.colors.surface} p-2 rounded-lg ${currentTheme.colors.border} border`}>
                      <SectionIcon size={16} className={currentTheme.colors.textSecondary} />
                    </div>
                    <h3 className={`text-lg font-medium ${currentTheme.colors.text}`}>
                      {section.title}
                    </h3>
                    <div className={`h-px flex-1 ${currentTheme.colors.border.replace('border-', 'bg-')} opacity-50`} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {section.items.map((item, index) => {
                      const ItemIcon = item.icon;
                      return (
                        <button
                          key={index}
                          className={`
                            p-4 text-left rounded-xl border transition-all duration-200 group
                            ${currentTheme.colors.background} ${currentTheme.colors.border}
                            ${currentTheme.colors.surfaceHover} hover:shadow-md hover:scale-102
                          `}
                          onClick={() => {
                            // Placeholder for future functionality
                            console.log(`Help: ${section.title} -> ${item.label}`);
                          }}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`${currentTheme.colors.surface} p-2 rounded-lg ${currentTheme.colors.border} border flex-shrink-0`}>
                              <ItemIcon size={16} className={currentTheme.colors.textSecondary} />
                            </div>
                            <div className="flex-1">
                              <h4 className={`font-medium ${currentTheme.colors.text} mb-1`}>
                                {item.label}
                              </h4>
                              <p className={`text-sm ${currentTheme.colors.textMuted}`}>
                                {item.description}
                              </p>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <div className={`text-sm ${currentTheme.colors.textMuted}`}>
                                →
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* FAQ Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className={`${currentTheme.colors.surface} p-2 rounded-lg ${currentTheme.colors.border} border`}>
                  <HelpCircle size={16} className={currentTheme.colors.textSecondary} />
                </div>
                <h3 className={`text-lg font-medium ${currentTheme.colors.text}`}>
                  Frequently Asked Questions
                </h3>
                <div className={`h-px flex-1 ${currentTheme.colors.border.replace('border-', 'bg-')} opacity-50`} />
              </div>

              <div className={`${currentTheme.colors.background} rounded-xl p-6 ${currentTheme.colors.border} border`}>
                <div className="space-y-4">
                  {[
                    {
                      question: "How do I create different types of blocks?",
                      answer: "Type '/' in any block to open the block menu and choose from headings, lists, and more."
                    },
                    {
                      question: "Can I organize my Slips with folders?",
                      answer: "Currently, you can pin important Slips and use search to find content. Folders are coming soon!"
                    },
                    {
                      question: "Is my data automatically saved?",
                      answer: "Yes! Your Slips are automatically saved as you type, so you never lose your work."
                    },
                    {
                      question: "How do I change the app theme?",
                      answer: "Click the Themes button in the sidebar to choose from beautiful light and dark themes."
                    }
                  ].map((faq, index) => (
                    <div key={index} className="space-y-2">
                      <h4 className={`font-medium ${currentTheme.colors.text}`}>
                        {faq.question}
                      </h4>
                      <p className={`text-sm ${currentTheme.colors.textMuted} leading-relaxed`}>
                        {faq.answer}
                      </p>
                      {index < 3 && <div className={`h-px ${currentTheme.colors.border.replace('border-', 'bg-')} opacity-30 my-4`} />}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Coming Soon Notice */}
            <div className={`${currentTheme.colors.accent} bg-opacity-10 rounded-2xl p-6 text-center`}>
              <div className={`w-16 h-16 ${currentTheme.colors.accent} bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4`}>
                <Book size={24} className={currentTheme.colors.accent.replace('bg-', 'text-')} />
              </div>
              <h3 className={`text-lg font-semibold ${currentTheme.colors.text} mb-2`}>
                More Help Resources Coming Soon
              </h3>
              <p className={`${currentTheme.colors.textMuted} max-w-md mx-auto`}>
                We're building comprehensive documentation, video tutorials, and community resources 
                to help you get the most out of your Slip-taking experience.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`${currentTheme.colors.border} border-t p-4 flex-shrink-0`}>
          <div className="flex items-center justify-between">
            <p className={`text-xs ${currentTheme.colors.textMuted}`}>
              Can't find what you're looking for? Contact our support team
            </p>
            <button
              onClick={onClose}
              className={`text-xs ${currentTheme.colors.textSecondary} ${currentTheme.colors.surfaceHover} px-3 py-1 rounded-full transition-colors duration-200 font-medium`}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}