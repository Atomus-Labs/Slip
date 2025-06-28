import React, { useRef, useEffect } from 'react';
import { Settings, X, User, Bell, Shield, Database, Palette, Keyboard, Info, Download, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '../contexts/ThemeContext';
import { useBooleanSetting } from '../hooks/useLocalStorage';

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

// Toggle Switch Component
interface ToggleSwitchProps {
  enabled: boolean;
  onToggle: () => void;
  label: string;
  description?: string;
  disabled?: boolean;
}

function ToggleSwitch({ enabled, onToggle, label, description, disabled = false }: ToggleSwitchProps) {
  const { currentTheme } = useTheme();
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className={`font-medium ${currentTheme.colors.text} ${disabled ? 'opacity-50' : ''}`}>
          {label}
        </div>
        {description && (
          <div className={`text-sm ${currentTheme.colors.textMuted} mt-1 ${disabled ? 'opacity-50' : ''}`}>
            {description}
          </div>
        )}
      </div>
      
      <button
        onClick={onToggle}
        disabled={disabled}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50
          ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
          ${enabled 
            ? `${currentTheme.colors.accent} focus:ring-${currentTheme.colors.accent.replace('bg-', '')}`
            : `${currentTheme.colors.surface} ${currentTheme.colors.border} border-2 focus:ring-gray-300`
          }
        `}
        role="switch"
        aria-checked={enabled}
        aria-label={label}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out
            shadow-lg ring-0
            ${enabled ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  );
}

export function SettingsMenu({ isOpen, onClose }: SettingsMenuProps) {
  const { currentTheme } = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);

  // Settings state with localStorage persistence
  const [autoUpdatesEnabled, toggleAutoUpdates] = useBooleanSetting(
    'auto-updates-enabled', 
    true,
    (enabled) => {
      toast.success(
        enabled 
          ? 'Automatic updates enabled' 
          : 'Automatic updates disabled',
        {
          description: enabled 
            ? 'You\'ll be notified when updates are available'
            : 'You can manually check for updates anytime'
        }
      );
    }
  );

  const [notificationsEnabled, toggleNotifications] = useBooleanSetting(
    'notifications-enabled',
    true,
    (enabled) => {
      toast.success(
        enabled 
          ? 'Notifications enabled' 
          : 'Notifications disabled'
      );
    }
  );

  const [autoSaveEnabled, toggleAutoSave] = useBooleanSetting(
    'auto-save-enabled',
    true,
    (enabled) => {
      toast.success(
        enabled 
          ? 'Auto-save enabled' 
          : 'Auto-save disabled',
        {
          description: enabled 
            ? 'Your Slips will be saved automatically'
            : 'Remember to save your Slips manually'
        }
      );
    }
  );

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

  // Manual update check function
  const handleCheckForUpdates = () => {
    toast.promise(
      // Simulate checking for updates
      new Promise((resolve) => {
        setTimeout(() => {
          resolve('No updates available');
        }, 2000);
      }),
      {
        loading: 'Checking for updates...',
        success: 'You\'re running the latest version!',
        error: 'Failed to check for updates'
      }
    );
  };

  if (!isOpen) return null;

  const settingsCategories = [
    {
      title: 'Updates & Maintenance',
      icon: Download,
      items: [
        {
          type: 'toggle' as const,
          label: 'Check for Updates',
          description: 'Automatically check for app updates',
          enabled: autoUpdatesEnabled,
          onToggle: toggleAutoUpdates
        },
        {
          type: 'button' as const,
          label: 'Check Now',
          description: 'Manually check for available updates',
          action: handleCheckForUpdates,
          icon: RotateCcw
        }
      ]
    },
    {
      title: 'Editor Preferences',
      icon: Palette,
      items: [
        {
          type: 'toggle' as const,
          label: 'Auto-save',
          description: 'Automatically save changes as you type',
          enabled: autoSaveEnabled,
          onToggle: toggleAutoSave
        },
        {
          type: 'button' as const,
          label: 'Default Slip Format',
          description: 'Set default block types and formatting',
          action: () => toast.info('Coming soon!')
        }
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        {
          type: 'toggle' as const,
          label: 'Push Notifications',
          description: 'Receive notifications for important updates',
          enabled: notificationsEnabled,
          onToggle: toggleNotifications
        },
        {
          type: 'button' as const,
          label: 'Notification Settings',
          description: 'Customize notification preferences',
          action: () => toast.info('Coming soon!')
        }
      ]
    },
    {
      title: 'Account',
      icon: User,
      items: [
        {
          type: 'button' as const,
          label: 'Profile Settings',
          description: 'Manage your personal information',
          action: () => toast.info('Coming soon!')
        },
        {
          type: 'button' as const,
          label: 'Data Export',
          description: 'Download your Slips and data',
          action: () => toast.info('Coming soon!')
        }
      ]
    },
    {
      title: 'Privacy & Security',
      icon: Shield,
      items: [
        {
          type: 'button' as const,
          label: 'Privacy Controls',
          description: 'Manage your privacy settings',
          action: () => toast.info('Coming soon!')
        },
        {
          type: 'button' as const,
          label: 'Backup Settings',
          description: 'Configure automatic backups',
          action: () => toast.info('Coming soon!')
        }
      ]
    },
    {
      title: 'Advanced',
      icon: Database,
      items: [
        {
          type: 'button' as const,
          label: 'Storage Management',
          description: 'View and manage storage usage',
          action: () => toast.info('Coming soon!')
        },
        {
          type: 'button' as const,
          label: 'Import/Export',
          description: 'Import Slips from other apps',
          action: () => toast.info('Coming soon!')
        }
      ]
    },
    {
      title: 'Shortcuts',
      icon: Keyboard,
      items: [
        {
          type: 'button' as const,
          label: 'Keyboard Shortcuts',
          description: 'View and customize shortcuts',
          action: () => toast.info('Coming soon!')
        },
        {
          type: 'button' as const,
          label: 'Quick Actions',
          description: 'Set up custom quick actions',
          action: () => toast.info('Coming soon!')
        }
      ]
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
                <Settings size={20} className={currentTheme.colors.accentText} />
              </div>
              <div>
                <h2 className={`text-xl font-semibold ${currentTheme.colors.text}`}>
                  Settings
                </h2>
                <p className={`text-sm ${currentTheme.colors.textMuted}`}>
                  Customize your Slip-taking experience
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 ${currentTheme.colors.textMuted} ${currentTheme.colors.surfaceHover} rounded-lg transition-colors duration-200 hover:scale-105`}
              title="Close settings"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-6 space-y-8">
            {settingsCategories.map((category) => {
              const Icon = category.icon;
              return (
                <div key={category.title} className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className={`${currentTheme.colors.surface} p-2 rounded-lg ${currentTheme.colors.border} border`}>
                      <Icon size={16} className={currentTheme.colors.textSecondary} />
                    </div>
                    <h3 className={`text-lg font-medium ${currentTheme.colors.text}`}>
                      {category.title}
                    </h3>
                    <div className={`h-px flex-1 ${currentTheme.colors.border.replace('border-', 'bg-')} opacity-50`} />
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {category.items.map((item, index) => (
                      <div
                        key={index}
                        className={`
                          p-4 rounded-xl border transition-all duration-200
                          ${currentTheme.colors.background} ${currentTheme.colors.border}
                        `}
                      >
                        {item.type === 'toggle' ? (
                          <ToggleSwitch
                            enabled={item.enabled}
                            onToggle={item.onToggle}
                            label={item.label}
                            description={item.description}
                          />
                        ) : (
                          <button
                            className={`
                              w-full text-left group transition-all duration-200
                              ${currentTheme.colors.surfaceHover} hover:shadow-sm rounded-lg p-2 -m-2
                            `}
                            onClick={item.action}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3">
                                  {item.icon && (
                                    <div className={`${currentTheme.colors.surface} p-1.5 rounded-md ${currentTheme.colors.border} border`}>
                                      <item.icon size={14} className={currentTheme.colors.textSecondary} />
                                    </div>
                                  )}
                                  <div>
                                    <h4 className={`font-medium ${currentTheme.colors.text}`}>
                                      {item.label}
                                    </h4>
                                    <p className={`text-sm ${currentTheme.colors.textMuted} mt-1`}>
                                      {item.description}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <div className={`text-sm ${currentTheme.colors.textMuted}`}>
                                  →
                                </div>
                              </div>
                            </div>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* App Info Section */}
            <div className={`${currentTheme.colors.accent} bg-opacity-10 rounded-2xl p-6 text-center`}>
              <div className={`w-16 h-16 ${currentTheme.colors.accent} bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4`}>
                <Info size={24} className={currentTheme.colors.accent.replace('bg-', 'text-')} />
              </div>
              <h3 className={`text-lg font-semibold ${currentTheme.colors.text} mb-2`}>
                Slip 1.0
              </h3>
              <p className={`${currentTheme.colors.textMuted} max-w-md mx-auto mb-4`}>
                Beautiful, distraction-free Slip-taking with powerful organization features.
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm">
                <span className={`${currentTheme.colors.textMuted}`}>
                  Last checked: {new Date().toLocaleDateString()}
                </span>
                <span className={`px-2 py-1 ${currentTheme.colors.surface} rounded-full text-xs ${currentTheme.colors.textSecondary}`}>
                  Up to date
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`${currentTheme.colors.border} border-t p-4 flex-shrink-0`}>
          <div className="flex items-center justify-between">
            <p className={`text-xs ${currentTheme.colors.textMuted}`}>
              Settings are automatically saved as you make changes
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