import packageJson from '../../package.json';

export const CURRENT_VERSION = packageJson.version;
export const GITHUB_REPO = 'atomus-labs/Slip'; // Replace with your actual repo path

export interface GitHubRelease {
  tag_name: string;
  name: string;
  body: string;
  published_at: string;
  html_url: string;
  assets: Array<{
    name: string;
    browser_download_url: string;
  }>;
}

export async function checkForUpdates(): Promise<{
  hasUpdate: boolean;
  latestVersion?: string;
  releaseInfo?: GitHubRelease;
}> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`
    );
    
    // Handle the case where no releases exist (404)
    if (response.status === 404) {
      return {
        hasUpdate: false,
        latestVersion: CURRENT_VERSION
      };
    }
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }
    
    const release: GitHubRelease = await response.json();
    const latestVersion = release.tag_name.replace(/^v/, ''); // Remove 'v' prefix if present
    
    const hasUpdate = compareVersions(latestVersion, CURRENT_VERSION) > 0;
    
    return {
      hasUpdate,
      latestVersion,
      releaseInfo: hasUpdate ? release : undefined
    };
  } catch (error) {
    console.error('Error checking for updates:', error);
    throw error;
  }
}

// Simple semantic version comparison for 2-dot versioning
function compareVersions(a: string, b: string): number {
  const aParts = a.split('.').map(Number);
  const bParts = b.split('.').map(Number);
  
  // Ensure both versions have exactly 2 parts (major.minor)
  while (aParts.length < 2) aParts.push(0);
  while (bParts.length < 2) bParts.push(0);
  
  // Compare major version first
  if (aParts[0] > bParts[0]) return 1;
  if (aParts[0] < bParts[0]) return -1;
  
  // If major versions are equal, compare minor version
  if (aParts[1] > bParts[1]) return 1;
  if (aParts[1] < bParts[1]) return -1;
  
  return 0; // Versions are equal
}