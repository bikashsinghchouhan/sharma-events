export function getDirectDriveLink(url) {
  if (!url || typeof url !== 'string') return url;
  
  // Convert Google Drive share links to direct display URLs
  if (url.includes('drive.google.com')) {
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      // Return the direct content link via lh3.googleusercontent.com
      return `https://lh3.googleusercontent.com/d/${match[1]}`;
    }
  }
  return url;
}
