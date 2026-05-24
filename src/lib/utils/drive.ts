/**
 * Extracts the Google Drive file ID from various URL formats.
 */
export function extractDriveFileId(url: string): string | null {
  if (!url) return null

  // Pattern 1: /file/d/FILE_ID/
  const fileDMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
  if (fileDMatch && fileDMatch[1]) {
    return fileDMatch[1]
  }

  // Pattern 2: ?id=FILE_ID or &id=FILE_ID
  const idParamMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/)
  if (idParamMatch && idParamMatch[1]) {
    return idParamMatch[1]
  }

  // Pattern 3: direct ID fallback (if the input is just the ID)
  if (/^[a-zA-Z0-9_-]{25,45}$/.test(url)) {
    return url
  }

  return null
}

/**
 * Converts a Google Drive link to a direct image rendering URL.
 */
export function getDriveImageUrl(driveUrl: string): string {
  const id = extractDriveFileId(driveUrl)
  if (id) {
    return `https://lh3.googleusercontent.com/d/${id}`
  }
  return driveUrl
}

/**
 * Converts a Google Drive link to a direct video download/streaming URL.
 */
export function getDriveVideoUrl(driveUrl: string): string {
  const id = extractDriveFileId(driveUrl)
  if (id) {
    return `https://docs.google.com/uc?export=download&id=${id}`
  }
  return driveUrl
}
