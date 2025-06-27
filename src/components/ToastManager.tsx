import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { toast as sonnerOriginalToast } from 'sonner';
import { X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

// Maximum number of toasts allowed (matches visibleToasts in main.tsx)
const MAX_TOASTS = 5;

// Global toast counter to track all toasts
let globalToastCount = 0;

// Create a new toast object that will serve as our public API
const publicToast = {} as typeof sonnerOriginalToast;

// Copy all original methods from sonner to our public toast
Object.assign(publicToast, sonnerOriginalToast);

// Override the toast function to enforce strict limits
const createLimitedToast = (type: keyof typeof sonnerOriginalToast) => {
  return (...args: any[]) => {
    // Check current toast count before creating new toast
    const currentToasts = document.querySelectorAll('[data-sonner-toast]');
    
    if (currentToasts.length >= MAX_TOASTS) {
      // Don't create new toast if we're at the limit
      console.log(`Toast limit reached (${MAX_TOASTS}). New toast blocked.`);
      return;
    }
    
    // Create the toast using the original sonner method
    const result = (sonnerOriginalToast as any)[type](...args);
    globalToastCount++;
    
    return result;
  };
};

// Override specific toast methods on our public toast object
publicToast.success = createLimitedToast('success');
publicToast.error = createLimitedToast('error');
publicToast.info = createLimitedToast('info');
publicToast.warning = createLimitedToast('warning');
publicToast.loading = createLimitedToast('loading');
publicToast.promise = createLimitedToast('promise');

// Override the default toast function
const limitedToast = (...args: any[]) => {
  const currentToasts = document.querySelectorAll('[data-sonner-toast]');
  
  if (currentToasts.length >= MAX_TOASTS) {
    console.log(`Toast limit reached (${MAX_TOASTS}). New toast blocked.`);
    return;
  }
  
  globalToastCount++;
  return sonnerOriginalToast(...args);
};

// Copy all properties from original toast to our limited version
Object.setPrototypeOf(limitedToast, sonnerOriginalToast);
Object.assign(limitedToast, publicToast);

// Keep the original dismiss function
limitedToast.dismiss = sonnerOriginalToast.dismiss;

// Export our limited toast as the default
export { limitedToast as toast };

export function ToastManager() {
  const [toastCount, setToastCount] = useState(0);
  const [showClearButton, setShowClearButton] = useState(false);
  const { currentTheme } = useTheme();

  // Count all toasts (should never exceed MAX_TOASTS now)
  const updateToastCount = useCallback(() => {
    const toasts = document.querySelectorAll('[data-sonner-toast]');
    const count = toasts.length;
    
    // Ensure count never exceeds our maximum
    const actualCount = Math.min(count, MAX_TOASTS);
    
    setToastCount(actualCount);
    setShowClearButton(actualCount > 1);
    
    // Update global counter
    globalToastCount = actualCount;
  }, []);

  useEffect(() => {
    // Initial count
    updateToastCount();

    // Set up observer for dynamic updates
    const observer = new MutationObserver(() => {
      // Small delay to ensure DOM updates are complete
      setTimeout(updateToastCount, 10);
    });

    // Wait for toaster to be available
    const checkForToaster = () => {
      const toasterElement = document.querySelector('[data-sonner-toaster]');
      if (toasterElement) {
        observer.observe(toasterElement, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['style', 'class']
        });
        updateToastCount();
      } else {
        setTimeout(checkForToaster, 50);
      }
    };

    checkForToaster();

    // Update on interval as backup
    const interval = setInterval(updateToastCount, 100);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, [updateToastCount]);

  const clearAllToasts = useCallback(() => {
    // Immediately hide the button and reset counters
    setShowClearButton(false);
    globalToastCount = 0;

    // Get all current toasts
    const toasts = document.querySelectorAll('[data-sonner-toast]');
    
    if (toasts.length === 0) {
      return;
    }

    // Dismiss all toasts immediately using the original sonner method
    sonnerOriginalToast.dismiss();

    // Force cleanup of any remaining elements
    setTimeout(() => {
      const remainingToasts = document.querySelectorAll('[data-sonner-toast]');
      remainingToasts.forEach(toastElement => {
        if (toastElement.parentNode) {
          toastElement.style.transition = 'all 0.2s ease';
          toastElement.style.transform = 'translateX(100%) scale(0.9)';
          toastElement.style.opacity = '0';
          
          setTimeout(() => {
            if (toastElement.parentNode) {
              toastElement.parentNode.removeChild(toastElement);
            }
          }, 200);
        }
      });
      
      // Reset everything after clearing
      setTimeout(() => {
        globalToastCount = 0;
        updateToastCount();
      }, 300);
    }, 50);
  }, [updateToastCount]);

  // Calculate button position - always in top area
  const calculateButtonPosition = () => {
    return { 
      top: 80, 
      right: 20 
    };
  };

  const ClearAllButton = () => {
    const { top, right } = calculateButtonPosition();
    const [isHovered, setIsHovered] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 50);

      return () => clearTimeout(timer);
    }, []);

    const buttonStyle: React.CSSProperties = {
      position: 'fixed',
      top: `${top}px`,
      right: `${right}px`,
      zIndex: 2147483647,
      background: 'var(--clear-button-bg)',
      border: '3px solid rgba(255, 255, 255, 0.2)',
      color: 'var(--clear-button-text)',
      padding: '14px 28px',
      borderRadius: '20px',
      fontSize: '16px',
      fontWeight: 800,
      cursor: 'pointer',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: isHovered 
        ? '0 25px 80px rgba(0, 0, 0, 0.4)' 
        : '0 20px 60px rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontFamily: 'inherit',
      whiteSpace: 'nowrap',
      userSelect: 'none',
      pointerEvents: 'auto',
      minWidth: '180px',
      justifyContent: 'center',
      height: '56px',
      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
      opacity: isVisible ? (isHovered ? 1 : 0.95) : 0,
      transform: isVisible 
        ? (isHovered ? 'translateY(-6px) scale(1.1)' : 'translateY(0) scale(1)')
        : 'translateY(-30px) scale(0.8)',
    };

    if (isHovered) {
      buttonStyle.background = 'var(--clear-button-hover)';
    }

    return (
      <button
        data-clear-all-button=""
        style={buttonStyle}
        onClick={clearAllToasts}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <X size={20} strokeWidth={3.5} style={{ flexShrink: 0 }} />
        Clear All ({toastCount})
      </button>
    );
  };

  return (
    <>
      {showClearButton && createPortal(<ClearAllButton />, document.body)}
    </>
  );
}