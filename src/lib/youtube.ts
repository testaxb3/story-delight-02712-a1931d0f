/**
 * YouTube utility functions
 */

/**
 * Extracts YouTube video ID from various URL formats
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/v/VIDEO_ID
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;

  // Remove whitespace
  url = url.trim();

  // Pattern 1: youtube.com/watch?v=VIDEO_ID
  const watchPattern = /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/;
  const watchMatch = url.match(watchPattern);
  if (watchMatch) return watchMatch[1];

  // Pattern 2: youtu.be/VIDEO_ID
  const shortPattern = /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const shortMatch = url.match(shortPattern);
  if (shortMatch) return shortMatch[1];

  // Pattern 3: youtube.com/embed/VIDEO_ID
  const embedPattern = /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
  const embedMatch = url.match(embedPattern);
  if (embedMatch) return embedMatch[1];

  // Pattern 4: youtube.com/v/VIDEO_ID
  const vPattern = /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/;
  const vMatch = url.match(vPattern);
  if (vMatch) return vMatch[1];

  // If URL is already just the video ID (11 characters)
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url;
  }

  return null;
}

/**
 * Gets YouTube thumbnail URL from video URL
 * @param videoUrl - YouTube video URL
 * @param quality - Thumbnail quality: 'maxres' (1920x1080), 'hq' (480x360), 'mq' (320x180), 'sd' (640x480)
 * @returns Thumbnail URL or null if video ID cannot be extracted
 */
export function getYouTubeThumbnail(
  videoUrl: string,
  quality: 'maxres' | 'hq' | 'mq' | 'sd' = 'maxres'
): string | null {
  const videoId = extractYouTubeVideoId(videoUrl);
  if (!videoId) return null;

  const qualityMap = {
    maxres: 'maxresdefault.jpg', // 1920x1080 (not available for all videos)
    hq: 'hqdefault.jpg',         // 480x360
    sd: 'sddefault.jpg',         // 640x480
    mq: 'mqdefault.jpg',         // 320x180
  };

  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}`;
}

/**
 * Fetches the best available YouTube thumbnail
 * Tries maxresdefault first, falls back to hqdefault if not available
 */
export async function getBestYouTubeThumbnail(videoUrl: string): Promise<string | null> {
  const videoId = extractYouTubeVideoId(videoUrl);
  if (!videoId) return null;

  // Try maxresdefault first (best quality)
  const maxresUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  try {
    const response = await fetch(maxresUrl, { method: 'HEAD' });

    // Check if image exists and is not the default 120x90 placeholder
    // maxresdefault returns 404 or 120x90 placeholder if not available
    if (response.ok) {
      const contentLength = response.headers.get('content-length');
      // If content-length is very small, it's likely the placeholder
      if (contentLength && parseInt(contentLength) > 5000) {
        return maxresUrl;
      }
    }
  } catch (error) {
    console.log('maxresdefault not available, falling back to hqdefault');
  }

  // Fallback to hqdefault (always available)
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

/**
 * Gets multiple thumbnail quality options
 */
export function getYouTubeThumbnailOptions(videoUrl: string): {
  maxres: string | null;
  hq: string | null;
  mq: string | null;
  sd: string | null;
} {
  const videoId = extractYouTubeVideoId(videoUrl);

  if (!videoId) {
    return { maxres: null, hq: null, mq: null, sd: null };
  }

  return {
    maxres: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    hq: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    sd: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
    mq: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
  };
}

/**
 * Validates if a URL is a valid YouTube URL
 */
export function isValidYouTubeUrl(url: string): boolean {
  return extractYouTubeVideoId(url) !== null;
}
