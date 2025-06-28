import { useEffect } from 'react';
import { checkForUpdates } from '../utils/versionUtils';
import { toast } from 'sonner';

export function useUpdateChecker(autoUpdatesEnabled: boolean) {
  useEffect(() => {
    if (!autoUpdatesEnabled) return;
    
    const checkInterval = setInterval(async () => {
      try {
        const result = await checkForUpdates();
        if (result.hasUpdate && result.releaseInfo) {
          toast.info(
            `Update available: v${result.latestVersion}`,
            {
              description: 'A new version of Slip is ready to download',
              action: {
                label: 'View Release',
                onClick: () => window.open(result.releaseInfo!.html_url, '_blank')
              },
              duration: Infinity // Keep until dismissed
            }
          );
        }
      } catch (error) {
        console.error('Auto-update check failed:', error);
      }
    }, 24 * 60 * 60 * 1000); // Check every 24 hours
    
    return () => clearInterval(checkInterval);
  }, [autoUpdatesEnabled]);
}