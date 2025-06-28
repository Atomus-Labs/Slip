import React, { useState, useEffect } from 'react';
import { Bell, X, Check, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  category: 'update' | 'tip' | 'sync' | 'system'; // Add category field
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationShadeProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDismiss: (id: string) => void;
  onClearAll: () => void;
}

export function NotificationShade({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDismiss,
  onClearAll
}: NotificationShadeProps) {
  const { currentTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);

  // Filter to only show critical notifications
  const criticalCategories = ['update', 'tip', 'sync'];
  const filteredNotifications = notifications.filter(notification => 
    criticalCategories.includes(notification.category)
  );

  const unreadCount = filteredNotifications.filter(n => !n.read).length;

  useEffect(() => {
    if (unreadCount > 0) {
      setHasNewNotifications(true);
      const timer = setTimeout(() => setHasNewNotifications(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [unreadCount]);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <Check size={16} className="text-green-500" />;
      case 'error':
        return <AlertCircle size={16} className="text-red-500" />;
      case 'warning':
        return <AlertTriangle size={16} className="text-yellow-500" />;
      case 'info':
      default:
        return <Info size={16} className="text-blue-500" />;
    }
  };

  const formatTime = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diff = now.getTime() - dateObj.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative p-3 rounded-xl transition-all duration-200 
          ${currentTheme.colors.surface} ${currentTheme.colors.border} border
          ${currentTheme.colors.surfaceHover} hover:shadow-md
          ${hasNewNotifications ? 'animate-pulse' : ''}
        `}
        title={`${unreadCount} unread notifications`}
      >
        <Bell size={20} className={currentTheme.colors.textSecondary} />
        
        {/* Notification Badge */}
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 font-medium">
            {unreadCount > 99 ? '99+' : unreadCount}
          </div>
        )}
      </button>

      {/* Notification Shade Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Notification Panel */}
          <div className={`
            absolute top-full right-0 mt-2 w-96 max-h-96 z-50
            ${currentTheme.colors.background} ${currentTheme.colors.border} border
            rounded-2xl shadow-2xl overflow-hidden
          `}>
            {/* Header */}
            <div className={`p-4 border-b ${currentTheme.colors.border} flex items-center justify-between`}>
              <h3 className={`font-semibold ${currentTheme.colors.text}`}>
                Notifications {unreadCount > 0 && `(${unreadCount})`}
              </h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllAsRead}
                    className={`text-xs px-3 py-1 rounded-lg ${currentTheme.colors.accent} ${currentTheme.colors.accentText} ${currentTheme.colors.accentHover} transition-colors`}
                  >
                    Mark all read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={onClearAll}
                    className={`text-xs px-3 py-1 rounded-lg ${currentTheme.colors.surface} ${currentTheme.colors.textMuted} ${currentTheme.colors.surfaceHover} transition-colors`}
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className={`text-center py-8 ${currentTheme.colors.textSecondary}`}>
                  <Bell size={32} className="mx-auto mb-2 opacity-50" />
                  <p>No critical notifications</p>
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`
                      p-4 rounded-lg border transition-all duration-200
                      ${currentTheme.colors.surface} ${currentTheme.colors.border}
                      ${!notification.read ? 'border-l-4 border-l-blue-500' : ''}
                    `}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h4 className={`text-sm font-medium ${currentTheme.colors.text} truncate`}>
                            {notification.title}
                          </h4>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDismiss(notification.id);
                            }}
                            className={`ml-2 p-1 rounded-lg ${currentTheme.colors.surfaceHover} opacity-0 group-hover:opacity-100 transition-opacity`}
                          >
                            <X size={12} className={currentTheme.colors.textMuted} />
                          </button>
                        </div>
                        <p className={`text-sm ${currentTheme.colors.textMuted} mt-1 line-clamp-2`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className={`text-xs ${currentTheme.colors.textMuted}`}>
                            {formatTime(notification.timestamp)}
                          </span>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}